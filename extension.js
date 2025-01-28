import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

const EXTENSION_SCHEMA = 'org.gnome.shell.extensions.night-style-monitor';
const INTERFACE_SCHEMA = 'org.gnome.desktop.interface';

export default class NightStyleMonitor extends Extension {
    constructor(metadata) {
        super(metadata);

        this._settings = new Gio.Settings({ schema: INTERFACE_SCHEMA });
        this._extensionSettings = new Gio.Settings({ schema: EXTENSION_SCHEMA });

        this._settingsHandler = null;
        this._colorSchemeHandler = null;

        this._updateSettings();
    }

    enable() {
        this._settingsHandler = this._extensionSettings.connect('changed', this._updateSettings.bind(this));
        this._colorSchemeHandler = this._settings.connect('changed::color-scheme', this._onColorSchemeChanged.bind(this));

        this._onColorSchemeChanged();
    }

    disable() {
        if (this._settingsHandler) {
            this._extensionSettings.disconnect(this._settingsHandler);
            this._settingsHandler = null;
        }

        if (this._colorSchemeHandler) {
            this._settings.disconnect(this._colorSchemeHandler);
            this._colorSchemeHandler = null;
        }
    }

    _onColorSchemeChanged() {
        const colorScheme = this._settings.get_enum('color-scheme');
        const isNightStyle = colorScheme === 1;
        const command = isNightStyle ? this.nightCommand : this.dayCommand;

        if (!command || !this._validateCommand(command)) {
            return;
        }

        if (this.showStartNotification) {
            Main.notify('Night Style Monitor', 'Starting command execution');
        }
        
        if (this.showResultNotification) {
            Main.notify('Night Style Monitor', this._runCommand(command));
        }
    }

    _runCommand(command) {
        try {
            const success = GLib.spawn_command_line_async(command);
            return success ? 'Command executed successfully' : 'Command execution failed';

        } catch (error) {
            log(`[Night Style Monitor] Command execution error: ${error.message}`);
            
            return `Extension error: ${error.message}`;
        }
    }

    _validateCommand(command) {
        return typeof command === 'string' && command.trim().length > 0;
    }

    _updateSettings() {
        this.nightCommand = this._extensionSettings.get_string('night-command');
        this.dayCommand = this._extensionSettings.get_string('day-command');

        this.showStartNotification = this._extensionSettings.get_boolean('show-start-notification');
        this.showResultNotification = this._extensionSettings.get_boolean('show-result-notification');
    }
}