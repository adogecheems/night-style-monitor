import Gio from 'gi://Gio';
import Adw from 'gi://Adw';

const EXTENSION_SCHEMA = 'org.gnome.shell.extensions.night-style-monitor';

export default class NightStylePreferences {
    constructor() {
        this._settings = new Gio.Settings({schema: EXTENSION_SCHEMA});
    }

    fillPreferencesWindow(window) {
        const page = new Adw.PreferencesPage();
        
        const group = new Adw.PreferencesGroup({
            title: 'Commands',
            description: 'Configure commands for day and night styles'
        });

        // 使用正确的 AdwEntryRow 属性
        const nightRow = new Adw.EntryRow({
            title: 'Night Command',
            // 移除不支持的 subtitle 属性
        });
        group.add(nightRow);

        const dayRow = new Adw.EntryRow({
            title: 'Day Command',
        });
        group.add(dayRow);

        // 绑定设置
        this._settings.bind(
            'night-command',
            nightRow,
            'text',
            Gio.SettingsBindFlags.DEFAULT
        );

        this._settings.bind(
            'day-command',
            dayRow,
            'text',
            Gio.SettingsBindFlags.DEFAULT
        );

        page.add(group);
        window.add(page);
    }
}