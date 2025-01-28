import Gio from 'gi://Gio';
import Adw from 'gi://Adw';

const EXTENSION_SCHEMA = 'org.gnome.shell.extensions.night-style-monitor';

export default class NightStylePreferences {
    constructor() {
        this._extensionSettings = new Gio.Settings({ schema: EXTENSION_SCHEMA });
    }

    fillPreferencesWindow(window) {
        const page = new Adw.PreferencesPage();

        // Command settings group
        const commandGroup = new Adw.PreferencesGroup({
            title: 'Commands',
            description: 'Set the commands to run when night style is enabled or disabled',
        });

        const nightCommandRow = new Adw.EntryRow({
            title: 'Nightly Command',
        });
        commandGroup.add(nightCommandRow);

        const dayCommandRow = new Adw.EntryRow({
            title: 'Daytime Command',
        });
        commandGroup.add(dayCommandRow);

        this._extensionSettings.bind(
            'night-command',
            nightCommandRow,
            'text',
            Gio.SettingsBindFlags.DEFAULT
        );

        this._extensionSettings.bind(
            'day-command',
            dayCommandRow,
            'text',
            Gio.SettingsBindFlags.DEFAULT
        );

        // Notification settings group
        const notifyGroup = new Adw.PreferencesGroup({
            title: 'Notifications',
            description: 'Configure notification settings'
        });

        const notifySwitch = new Adw.SwitchRow({
            title: 'Show Notifications',
            subtitle: 'Show notifications when night style is enabled or disabled',
        });
        nightGroup.add(notifySwitch);

        const ifShowStartingSwitch = new Adw.SwitchRow({
            title: 'Show Starting Notification',
            subtitle: 'Whether to display a notification when the command starts executing',
        })
        notifyGroup.add(ifShowStartingSwitch);

        const ifShowResultSwitch = new Adw.SwitchRow({
            title: 'Show Result Notification',
            subtitle: 'Whether to display a notification when the command finishes executing',
        })
        notifyGroup.add(ifShowResultSwitch);

        this._settings.bind(
            'show-notifications',
            notifySwitch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        this._settings.bind(
            'show-starting-notification',
            ifShowStartingSwitch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        this._settings.bind(
            'show-result-notification',
            ifShowResultSwitch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        page.add(commandGroup);
        page.add(notifyGroup);
        window.add(page);
    }
}