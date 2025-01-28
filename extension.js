import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import {Main} from 'resource:///org/gnome/shell/ui/main.js';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

const EXTENSION_SCHEMA = 'org.gnome.shell.extensions.night-style-monitor';

export default class NightStyleMonitor extends Extension {
    constructor(metadata) {
        super(metadata);

        this._settings = new Gio.Settings({ schema: 'org.gnome.desktop.interface' });
        this._extensionSettings = new Gio.Settings({ schema: EXTENSION_SCHEMA });

        this._updateSettings();
        this._settingsHandler = this._extensionSettings.connect('changed', this._updateSettings.bind(this));
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

        if (colorScheme === 1) {
            log('Night style is enabled');
            let notification = this._runCommand(this.nightCommand);

        } else {
            log('Night style is disabled');
            let notification = this._runCommand(this.dayCommand);
        }

        if (this.ifShowNotify) {
            if (this.ifShowStarting) {
                Main.notify('Night Style Monitor', 'Command started executing');
            }

            if (this.ifShowResult) {
                Main.notify('Night Style Monitor', notification);
            }
        }
    }

    _runCommand(command) {
        try {
            let [success, stdout, stderr, status] = GLib.spawn_command_line_sync(command);

            let errorOutput = '';
            if (stderr instanceof Uint8Array) {
                errorOutput = new TextDecoder().decode(stderr).trim();
            }

            if (errorOutput) {
                return errorOutput;
            }

            let output = '';
            if (stdout instanceof Uint8Array) {
                output = new TextDecoder().decode(stdout).trim();
            }

            if (output) {
                return output;
            }

            return status === 0 ? "Successful" : "Failed";

        } catch (e) {
            return `Error: ${e.message}`;
        }
    }

    _updateSettings() {
        this.nightCommand = this._extensionSettings.get_string('night-command');
        this.dayCommand = this._extensionSettings.get_string('day-command');

        this.ifShowNotify = this._extensionSettings.get_boolean('show-notifications');
        this.ifShowStarting = this._extensionSettings.get_boolean('show-starting-notification');
        this.ifShowResult = this._extensionSettings.get_boolean('show-result-notification');
    }
}