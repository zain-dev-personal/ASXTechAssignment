import { LightningElement, api } from 'lwc';

export default class ToggleCell extends LightningElement {
    @api recordId;
    @api checked;

    handleChange(event) {
        this.dispatchEvent(new CustomEvent('togglestatus', {
            composed: true,
            bubbles: true,
            detail: {
                recordId: this.recordId,
                status: event.target.checked
            }
        }));
    }
}
