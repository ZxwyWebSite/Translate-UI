import * as React from 'react';
import { AppBar, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import GitHubIcon from '@mui/icons-material/GitHub';
import GTranslateIcon from '@mui/icons-material/GTranslate';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';
import conf from './site.config';

// 顶部菜单栏相关
export default function AppBarFunc() {
  // 应用栏相关
  const [AppState, setAppState] = React.useState<null | HTMLElement>(null);
  const handleAppClick = (event: React.MouseEvent<HTMLElement>) => {
    setAppState(event.currentTarget);
  };
  const handleAppClose = () => {
    setAppState(null);
  };

  // 左侧抽屉栏
  const [MenuState, setMenuState] = React.useState<boolean>(false)

  return (
    <AppBar position='static' className=''>
      <Toolbar>
        <Tooltip title='主菜单'>
          <IconButton size='large' edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }} onClick={() => { setMenuState(true) }}>
            <MenuIcon />
          </IconButton>
        </Tooltip>
        <Drawer anchor='left' open={MenuState} onClose={() => { setMenuState(false) }}>
          <List sx={{ width: 263 }}>
            <ListItem key='About' disablePadding>
              <ListItemButton onClick={() => { alert(conf.site.description) }}>
                <ListItemIcon><InfoIcon /></ListItemIcon>
                <ListItemText primary={'关于 ' + conf.site.title} />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>

        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          {conf.site.title}
        </Typography>

        <Tooltip title='更多应用'>
          <IconButton size='large' color='inherit' aria-label='apps' onClick={handleAppClick}>
            <AppsIcon />
          </IconButton>
        </Tooltip>
        <Menu
          id='menu-apps' anchorEl={AppState} open={Boolean(AppState)} onClose={handleAppClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <MenuItem onClick={handleAppClose}>
            <ListItemIcon><GTranslateIcon /></ListItemIcon>
            {conf.site.title}
          </MenuItem>
        </Menu>

        <Tooltip title='Github仓库'>
          <IconButton size='large' color='inherit' aria-label='github' href='https://github.com/ZxwyWebSite/Translate-UI' target='_blank'>
            <GitHubIcon />
          </IconButton>
        </Tooltip>

      </Toolbar>
    </AppBar>
  )
}
