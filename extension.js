import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

const EXTENSION_SCHEMA = 'org.gnome.shell.extensions.night-style-monitor';

export default class NightStyleMonitor extends Extension {
    constructor(metadata) {
        super(metadata);

        this._settings = new Gio.Settings({ schema: 'org.gnome.desktop.interface' });
        this._extensionSettings = new Gio.Settings({ schema: EXTENSION_SCHEMA });

        this._updateCommands();
        this._settingsHandler = this._extensionSettings.connect('changed', this._updateCommands.bind(this));
        this._colorSchemeHandler = null;
    }

    enable() {
        log('NightStyleMonitor enabled');
        
        this._colorSchemeHandler = this._settings.connect('changed::color-scheme', this._onColorSchemeChanged.bind(this));
        this._onColorSchemeChanged();
    }

    disable() {
        log('NightStyleMonitor disabled');

        if (this._colorSchemeHandler) {
            this._settings.disconnect(this._colorSchemeHandler);
            this._colorSchemeHandler = null;
        }
        
        if (this._settingsHandler) {
            this._extensionSettings.disconnect(this._settingsHandler);
            this._settingsHandler = null;
        }
    }

    _onColorSchemeChanged() {
        const colorScheme = this._settings.get_enum('color-scheme');
        log(`Current color scheme: ${colorScheme}`);

        if (colorScheme === 1) { 
            log('Night style is enabled');
            this._runCommand(this.nightCommand);

        } else {
            log('Night style is disabled');
            this._runCommand(this.dayCommand);
        }
    }

    _runCommand(command) {
        try {
            GLib.spawn_command_line_async(command);
        } catch (e) {
            log(`Failed to run command: ${command}, error: ${e.message}`);
        }
    }

    _updateCommands() {
        this.nightCommand = this._extensionSettings.get_string('night-command');
        this.dayCommand = this._extensionSettings.get_string('day-command');
    }
}