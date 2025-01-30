# Night Style Monitor

Night Style Monitor 是一个 GNOME 扩展，可以在 GNOME 的夜间样式启用/禁用（右上角快捷设置 ->  暗色样式）时执行自定义命令。

## 安装

1. 打开你的浏览器，访问 [Night Style Monitor 扩展页面](https://extensions.gnome.org/extension/7828/night-style-monitor/)。
2. 点击页面上的开关按钮以安装扩展。

## 配置说明

### 主要设置

- `Nightly Command`：启用夜间样式时运行的命令
- `Daytime Command`：禁用夜间样式时运行的命令

### 示例

```bash
# 夜间：切换到深色主题
gsettings set org.gnome.desktop.interface gtk-theme 'Adwaita-dark'
# 白天：切换到浅色主题
gsettings set org.gnome.desktop.interface gtk-theme 'Adwaita'

# 说句题外话，如果你是要切换 kvantum 主题，可以使用下面的命令（记得使用 qt5ct/qt6ct，否则配色方案诡异）
# 夜间：切换到深色主题
kvantummanager --set <主题名称+Dark>
# 白天：切换到浅色主题
kvantummanager --set <主题名称>
```

## 使用

配置完成后，Night Style Monitor 将根据系统的夜间样式自动执行相应的自定义命令。
