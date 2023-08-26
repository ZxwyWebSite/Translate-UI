import * as React from 'react';
import { Backdrop, Box, Button, Card, CardContent, CircularProgress, Container, FormControl, Grid, IconButton, InputLabel, Link, MenuItem, Paper, Popover, Select, Slider, Snackbar, Stack, TextField, Tooltip, Typography } from '@mui/material';
// import PopoverMenu from './PopoverMenu';
// import ProTip from './ProTip';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FlagIcon from '@mui/icons-material/Flag';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import SyncIcon from '@mui/icons-material/Sync';
import TranslateIcon from '@mui/icons-material/Translate';
import axios from 'axios'
import conf from './site.config';

// 类型声明
type Mode = 'grass' | 'trans'

// 底部版权信息
function Copyright() {
  return (
    <Typography variant="body2" color='text.secondary' align='center'>
      <a className='hidden md:inline'>Copyright </a>
      {'© 2021-' + new Date().getFullYear() + ' '}
      <Link color='inherit' href='https://www.zxwy.tk/' target='_blank' underline='hover'>
        ZxwyWebSite
      </Link>
      {' All rights reserved.'}
    </Typography>
  );
}

// 将文本复制到剪切板
function copyToBoard(s: string): string {
  try {
    navigator.clipboard.writeText(s);
  } catch (err) {
    return err as string;
  }
  return '';
}

// 主程序
export default function App() {
  // 欢迎语输出状态
  const [helloTrans, setHelloTrans] = React.useState<boolean>(false);
  const [helloGrass, setHelloGrass] = React.useState<boolean>(false);

  // 工作模式相关 mode('trans': '翻译', 'grass': '生草')
  const [mode, setMode] = React.useState<Mode>('trans');
  const selectMode = (s: string) => {
    // 判断当前模式是否为输入模式
    if (s == mode) {
      return 'contained';// 返回高亮样式
    }
    return 'outlined';// 否则默认白底样式
  }

  // 源译语言相关 ('fromLang': '源语言', 'toLang': '译语言')
  const [fromLang, setFromLang] = React.useState<string>('auto');
  const [toLang, setToLang] = React.useState<string>('zh');

  // 生草力度相关
  const [force, setForce] = React.useState<number>(2);
  const [popEl, setPopEl] = React.useState<HTMLButtonElement | null>(null);
  const handlePopClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPopEl(event.currentTarget);
  };

  // 等待背景板相关
  const [backLoad, setBackLoad] = React.useState<boolean>(false);
  const doTranslate = () => {
    const input = (document.getElementById('text-input') as HTMLInputElement).value;
    const output = document.getElementById('text-output') as HTMLInputElement
    if (input == '') {
      output.value = '待翻译内容为空 (⊙_⊙)？';
      return;
    }
    const length = input.length;
    if (length > 1000) {
      output.value = '字数超限(' + length as string + ' > 1000)，请分段翻译！';
      return;
    }
    if ((mode == 'trans') && (fromLang == toLang)) {
      output.value = '翻译模式下源语言不可与译语言相同！';
      return;
    }
    console.log('创建任务: { ' + 'Mode: ' + mode + ', From: ' + fromLang + ', To: ' + toLang + ', Force: ' + force + ' }');
    setBackLoad(true);
    const start = new Date().getTime();
    axios.get(conf.api.address + '?mode=' + mode + '&from=' + fromLang + '&to=' + toLang + '&force=' + force as string + '&text=' + encodeURI(input))
      .then((resp) => {
        const data = resp.data;
        if (data['isOk'] == 'ok') {
          output.value = decodeURIComponent(data['text']);
        } else {
          output.value = '获取数据失败: ' + data['msg'];
        }
        console.log('本次翻译路径: ' + data['msg']);
      })
      .catch((err) => {
        output.value = "生草过程中遇到错误！\n\n请尝试以下办法解决：\n1、检查是否有特殊字符，尽量不要包含除了文字和必要标点以外的字符。\n2、如果文段较长，可尝试分开多段生草。\n3、如果包含换行，可尝试把换行替换成逗号再试。\n4、也有可能是谷歌翻译的服务器抽风，请稍后再试。\n5、我们的后端服务器可能炸了，请稍后再试。";
        console.error('请求翻译接口时发生错误: ' + err);
      })
      .then(() => {
        console.log('执行结束, 耗时 ' + `${new Date().getTime() - start} ms`);
        setBackLoad(false);
      });
  }

  return (
    <Container fixed>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backLoad}
      >
        <CircularProgress color='inherit' />
      </Backdrop>

      <Grid container spacing={1} className='my-1 lg:my-2'>
        <Grid item xs='auto'>
          {/* <Tooltip title='将一段文字译为另一种语言'> */}
          <Button variant={selectMode('trans')} startIcon={<TranslateIcon />} onClick={() => {
            setMode('trans');
            if (!helloTrans) {
              console.log(conf.welcome.trans);
              setHelloTrans(true);
            }
          }}>
            翻译
          </Button>
          {/* </Tooltip> */}
        </Grid>
        <Grid item xs='auto'>
          {/* <Tooltip title='让一段文字变得生草'> */}
          <Button variant={selectMode('grass')} startIcon={<SyncIcon />} onClick={() => {
            setMode('grass');
            if (!helloGrass) {
              console.log(conf.welcome.grass);
              setHelloGrass(true);
            }
            // handlePopClick(e);
          }} onContextMenu={(e) => {
            e.preventDefault();
            handlePopClick(e);
          }}>
            生草
          </Button>
          {/* </Tooltip> */}
          <Popover
            id='grass-popover' open={Boolean(popEl)} anchorEl={popEl}
            onClose={() => { setPopEl(null) }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            {/* <Typography sx={{ p: 2 }}>The content of the Popover.</Typography> */}
            <Card sx={{ minWidth: 250 }} className='inset-x-px'>
              <Tooltip title={'翻译次数 ' + force as string} placement='top' arrow>
                <Stack direction='row'>
                  <ArrowLeftIcon />
                  <Slider
                    aria-label='Force' value={force} size='small'
                    min={1} step={1} max={10} sx={{ padding: '13px 0 !important' }}
                    // valueLabelDisplay='auto'
                    onChange={(_, n) => { setForce(n as number) }}
                  />
                  <ArrowRightIcon />
                </Stack>
              </Tooltip>
            </Card>
          </Popover>
        </Grid>
        <Grid item xs textAlign='end'>
          {/* <Tooltip title='Zxwy翻译，启动！'> */}
          <Button variant='contained' color='secondary' startIcon={<FlagIcon />} onClick={() => { doTranslate() }}>
            启动
          </Button>
          {/* </Tooltip> */}
        </Grid>
      </Grid>

      <Grid container spacing={1} className='my-2'>
        <Grid item xs={6}>
          <TextField id='text-input' label='输入' multiline minRows={10} fullWidth placeholder='源' InputLabelProps={{ shrink: true }} size='small' maxRows={60} />
        </Grid>
        <Grid item xs={6}>
          <TextField id='text-output' label='输出' multiline minRows={10} fullWidth placeholder='译' InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} size='small' maxRows={60} />
        </Grid>
      </Grid>

      <Grid container spacing={1} columns={14} className='my-2'>
        <Grid item xs={6} sm>
          <Stack direction='row' spacing={1}>
            <Tooltip title='复制源文'>
              <IconButton aria-label='copy' size='small' onClick={() => {
                let input = (document.getElementById('text-input') as HTMLInputElement).value;
                let err = copyToBoard(input);
                if (err != '') {
                  console.error('复制源文内容失败: ' + err);
                  console.warn("当前源文:\n" + input);
                }
              }}><ContentCopyIcon /></IconButton>
            </Tooltip>
            <FormControl fullWidth size='small'>
              <InputLabel id='fromlang-select-label'>源语言</InputLabel>
              <Select
                labelId='fromlang-select-label'
                id='fromlang-select'
                value={fromLang}
                label='FromLang'
                onChange={(e) => { setFromLang(e.target.value as string) }}
              >
                <MenuItem value='auto'>自动检测</MenuItem>
                <MenuItem value='zh'>中文（zh）</MenuItem>
                <MenuItem value='en'>英语（en）</MenuItem>
                <MenuItem value='ja'>日语（ja）</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Grid>
        <Grid item xs sm='auto' md={1} textAlign='center'>
          <Tooltip title='源译转换'>
            <IconButton aria-label='sync' onClick={() => {
              (document.getElementById('text-input') as HTMLInputElement).value = (document.getElementById('text-output') as HTMLInputElement).value;
              (document.getElementById('text-output') as HTMLInputElement).value = ''
            }}><SyncAltIcon /></IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={6} sm>
          <Stack direction='row' spacing={1}>
            <FormControl fullWidth size='small'>
              <InputLabel id='tolang-select-label'>译语言</InputLabel>
              <Select
                labelId='tolang-select-label'
                id='tolang-select'
                value={toLang}
                label='ToLang'
                onChange={(e) => { setToLang(e.target.value as string) }}
              >
                <MenuItem value='zh'>中文（zh）</MenuItem>
                <MenuItem value='en'>英语（en）</MenuItem>
                <MenuItem value='ja'>日语（ja）</MenuItem>
              </Select>
            </FormControl>
            <Tooltip title='复制译文'>
              <IconButton aria-label='copy' size='small' onClick={() => {
                let input = (document.getElementById('text-output') as HTMLInputElement).value;
                let err = copyToBoard(input);
                if (err != '') {
                  console.error('复制译文内容失败: ' + err);
                  console.warn("当前译文:\n" + input);
                }
              }}><ContentCopyIcon /></IconButton>
            </Tooltip>
          </Stack>
        </Grid>
      </Grid>

      {/* <div className="my-4">
        <Typography variant="h4" component="h1" gutterBottom>
          Material UI Create React App example with Tailwind CSS in TypeScript
        </Typography>
        <Slider
          className="my-4"
          defaultValue={30}
          classes={{ active: 'shadow-none' }}
          slotProps={{ thumb: { className: 'hover:shadow-none' } }}
        />
        <PopoverMenu />
        <ProTip />
      </div> */}
      <Paper variant='outlined' className='my-3'>
        <Stack direction='row' spacing={3}>
          <Typography>
            使<br />用<br />方<br />法
          </Typography>
          <Typography>
            翻译模式：<br />
            <a>1. 输入一段文字</a><br />
            <a>2. 选择原文语言</a><br />
            <a>3. 选择翻译语言</a><br />
            <a>4. 点击立即翻译</a>
          </Typography>
          <Typography>
            生草模式：<br />
            <a>1. 输入一段文字</a><br />
            <a>2. 选择原文语言</a><br />
            <a>3. 选择翻译次数</a><br />
            <a>4. 点击立即生草</a>
          </Typography>
          {/* <Typography>
            其<br />它<br />信<br />息
          </Typography>
          <Typography>
            ？？？？：<br />
            <a>1. ？？？？？？</a><br />
            <a>2. ？？？？？？</a><br />
            <a>3. ？？？？？？</a><br />
            <a>4. ？？？？？？</a>
          </Typography> */}
        </Stack>
      </Paper>

      <div className='my-4'>
        <Copyright />
      </div>

    </Container>
  );
}
