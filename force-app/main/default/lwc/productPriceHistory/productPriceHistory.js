import { LightningElement, api, wire, track } from 'lwc';
import getPriceHistories from '@salesforce/apex/ProductController.getPriceHistories';
import { refreshApex } from '@salesforce/apex';

const COLUMNS = [
    { label: 'Old Price', fieldName: 'Old_Price__c', type: 'currency', typeAttributes: { currencyCode: 'AUD', step: '0.01' } },
    { label: 'New Price', fieldName: 'New_Price__c', type: 'currency', typeAttributes: { currencyCode: 'AUD', step: '0.01' } },
    { label: 'Date Changed', fieldName: 'Date_Changed__c', type: 'date', typeAttributes: { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: '2-digit' } }
];

export default class ProductPriceHistory extends LightningElement {
    @api productId;
    
    columns = COLUMNS;
    @track histories = [];
    @track hasHistories = false;
    error;
    wiredHistoriesResult;

    @wire(getPriceHistories, { productId: '$productId' })
    wiredHistories(result) {
        this.wiredHistoriesResult = result;
        const { error, data } = result;
        if (data) {
            this.histories = data;
            this.hasHistories = data.length > 0;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.histories = [];
            this.hasHistories = false;
        }
    }

    @api
    refresh() {
        return refreshApex(this.wiredHistoriesResult);
    }
}
