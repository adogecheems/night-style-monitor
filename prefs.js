import Gio from 'gi://Gio';
import Adw from 'gi://Adw';

const EXTENSION_SCHEMA = 'org.gnome.shell.extensions.night-style-monitor';

export default class NightStyleMonitorPreferences {
    constructor() {
        this._settings = new Gio.Settings({ schema: EXTENSION_SCHEMA });
    }

    fillPreferencesWindow(window) {
        const page = new Adw.PreferencesPage();
        
        page.add(this._createCommandGroup());
        page.add(this._createNotificationGroup());
        
        window.add(page);
    }

    _createCommandGroup() {
        const group = new Adw.PreferencesGroup({
            title: 'Commands',
            description: 'Set commands to run when switching styles'
        });

        const nightCommand = new Adw.EntryRow({ title: 'Night Command' });
        const dayCommand = new Adw.EntryRow({ title: 'Day Command' });

        this._bindSetting('night-command', nightCommand);
        this._bindSetting('day-command', dayCommand);

        group.add(nightCommand);
        group.add(dayCommand);

        return group;
    }

    _createNotificationGroup() {
        const group = new Adw.PreferencesGroup({
            title: 'Notifications',
            description: 'Configure notification settings'
        });

        const startNotify = new Adw.SwitchRow({
            title: 'Show Start Notification',
            subtitle: 'Show notification when command starts'
        });

        const resultNotify = new Adw.SwitchRow({
            title: 'Show Result Notification',
            subtitle: 'Show notification when command completes'
        });

        this._bindSetting('show-start-notification', startNotify, 'active');
        this._bindSetting('show-result-notification', resultNotify, 'active');

        group.add(startNotify);
        group.add(resultNotify);

        return group;
    }

    _bindSetting(key, widget, property = 'text') {
        try {
            this._settings.bind(
                key,
                widget,
                property,
                Gio.SettingsBindFlags.DEFAULT
            );
        } catch (error) {
            console.error(`Failed to bind setting ${key}: ${error}`);
        }
    }
}