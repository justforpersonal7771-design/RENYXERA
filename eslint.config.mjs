import { defineConfig } from "eslint/config";
import next from "eslint-config-next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([{
    extends: [...next],
    rules: {
        // The browser's own date/time popups can't be themed; use components/ui/date-picker.tsx
        // and components/ui/time-picker.tsx instead.
        "no-restricted-syntax": ["error", {
            selector: "JSXAttribute[name.name='type'][value.value=/^(date|time|datetime-local|month|week)$/]",
            message: "Native date/time inputs show the browser's default picker. Use DatePicker / TimePicker from components/ui.",
        }],
    },
}]);
