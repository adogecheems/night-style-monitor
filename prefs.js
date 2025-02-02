import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
import Gio from 'gi://Gio';
import Adw from 'gi://Adw';

const EXTENSION_SCHEMA = 'org.gnome.shell.extensions.night-style-monitor';

export default class NightStyleMonitorPreferences extends ExtensionPreferences {
    constructor(metadata) {
        super(metadata);
    }

    fillPreferencesWindow(window) {
        this._settings = new Gio.Settings({ schema: EXTENSION_SCHEMA });
        window.connect('close-request', () => {
            this._settings = null;
        });

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

        const nightCommand = new Adw.EntryRow({ title: 'Nightly Command' });
        const dayCommand = new Adw.EntryRow({ title: 'Daytime Command' });

        this._bindSetting('night-command', nightCommand);
        this._bindSetting('day-command', dayCommand);

        group.add(nightCommand);
        group.add(dayCommand);

        return group;
    }

    _createNotificationGroup() {
        const group = new Adw.PreferencesGroup({
            title: 'Notifications',
            description: 'Configure notification settings (Note: It is best not to enable two notifications at the same time)'
        });

        const startNotify = new Adw.SwitchRow({
            title: 'Show Start Notification',
            subtitle: 'Show notification when command starts'
        });

        this._bindSetting('show-start-notification', startNotify, 'active');

        group.add(startNotify);

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
            console.error(`[Night Style Monitor] Failed to bind setting ${key}: ${error}`);
        }
    }
}