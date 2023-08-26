<?php
// Translate-UI/TranslateApi v2.0 最新版
include('vendor/autoload.php');
use Stichoza\GoogleTranslate\GoogleTranslate;
// 一键翻译 ['源语言','译语言','文本']['结果']
function Translate($from, $to, $text) {
    $tr = new GoogleTranslate();
    // $tr->setOptions(['proxy' => 'socks5://user:password@address:port']); // 大陆服务器可使用代理
    $tr->setSource($from);
    $tr->setTarget($to);
    // $tr->setClient('webapp'); // 翻译质量 ['gtx','webapp'] (不推荐修改)
    return $tr->translate($text);
}
// 生草模式 ['源语言','译语言','文本','重复次数']['结果'] (重复次数不得大于38)
function Grass($from, $to, $text, $num) {
    if ($num > 38) {
        return ['', '超出最大翻译次数限制'];
    }
    $i18n = ['ar', 'be', 'bg', 'ca', 'cs', 'da', 'de', 'el', 'en', 'es', 'et', 'fi', 'fr', 'hr', 'hu', 'is', 'it', 'iw', 'ja', 'ko', 'lt', 'lv', 'mk', 'nl', 'no', 'pl', 'pt', 'ro', 'ru', 'sh', 'sk', 'sl', 'sq', 'sr', 'sv', 'th', 'tr', 'uk', 'zh'];
    $NewLang = $from;
    $transpath = $from; // 翻译路径 (zh->ja->en->zh)
    for ($i = 0; $i < $num; $i += 1) {
        $OldLang = $NewLang;
        // 限制重复语言 (连续重复 '$OldLang == $NewLang', 永不重复 'strpos($transpath, $NewLang) !== false')
        do {
            $NewLang = $i18n[rand(0, 38)];
        } while (strpos($transpath, $NewLang) !== false);
        $transpath .= '->' . $NewLang;
        $text = Translate($OldLang, $NewLang, $text);
    }
    return [Translate($NewLang, $to, $text), $transpath . '->' . $to];
}
// 获取传入参数
$out = null;
error_reporting(0);
$mode = $_GET['mode']; // 运行模式
$from = $_GET['from']; // 源语言
$tolang = $_GET['to']; // 译语言
$text = $_GET['text']; // 待翻译文本
$num = $_GET['force']; // 生草次数
if ($from == null) {
    $msg = '缺少源语言(from)参数';
} elseif ($tolang == null) {
    $msg = '缺少译语言(to)参数';
} elseif ($text == null) {
    $msg = '缺少待翻译文本(text)参数';
} else {
    switch ($mode) {
    case 'grass':
        [$out, $msg] = Grass($from, $tolang, $text, $num);
        break;
    case 'trans':
        $out = Translate($from, $tolang, $text);
        $msg = $from . '->' . $tolang;
        break;
    default:
        $msg = '未定义的运行模式';
        break;
    }
}
// 输出处理结果
// header('Access-Control-Allow-Origin: *'); // 允许跨域 (生产环境建议关闭)
if ($out == null) {
    echo json_encode(array('isOk' => 'err', 'msg' => $msg));
} else {
    echo json_encode(array('isOk' => 'ok', 'msg' => $msg, 'text' => $out));
}
?>