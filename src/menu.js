const AppMenu = [
  {
    label: '操作',
    submenu: [
      {
        label: '锁定工具',
        accelerator: 'ctrl+l',
        click: () => {
          console.log('锁定工具');
        },
      },
    ],
  },
];

export default AppMenu;
