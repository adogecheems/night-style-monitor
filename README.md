# Night Style Monitor

[简体中文](https://github.com/adogecheems/night-style-monitor/blob/main/README_cn.md) | [English](https://github.com/adogecheems/night-style-monitor/blob/main/README.md)

---

Night Style Monitor is a GNOME extension that executes custom commands when GNOME's night style is enabled/disabled (Quick Settings in the top right corner -> Dark Style).

## Installation

1. Open your browser and visit the [Night Style Monitor extension page](https://extensions.gnome.org/extension/7828/night-style-monitor/).
2. Click the toggle button on the page to install the extension.

## Configuration

### Main Settings

- `Nightly Command`: Command to run when night style is enabled
- `Daytime Command`: Command to run when night style is disabled

### Examples

```bash
# Night: Switch to dark theme
gsettings set org.gnome.desktop.interface gtk-theme 'Adwaita-dark'
# Day: Switch to light theme
gsettings set org.gnome.desktop.interface gtk-theme 'Adwaita'

# As a side note, if you want to switch Kvantum themes, you can use the following commands (remember to use qt5ct/qt6ct, otherwise the color scheme will be weird)
# Night: Switch to dark theme
kvantummanager --set <theme_name+Dark>
# Day: Switch to light theme
kvantummanager --set <theme_name>
```

## Usage

Once configured, Night Style Monitor will automatically execute the corresponding custom commands based on the system's night style.
