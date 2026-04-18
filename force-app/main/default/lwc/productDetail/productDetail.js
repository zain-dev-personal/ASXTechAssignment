import { LightningElement, track, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import ACTIVE_FIELD from '@salesforce/schema/Product__c.Active__c';
import IMAGE_ID_FIELD from '@salesforce/schema/Product__c.Product_Image_Id__c';

// LMS Imports
import { subscribe, unsubscribe, MessageContext, APPLICATION_SCOPE } from 'lightning/messageService';
import PRODUCT_SELECTED_CHANNEL from '@salesforce/messageChannel/ProductSelected__c';

export default class ProductDetail extends LightningElement {
    @track productId;
    subscription = null;

    @wire(MessageContext)
    messageContext;

    @wire(getRecord, { recordId: '$productId', fields: [ACTIVE_FIELD, IMAGE_ID_FIELD] })
    productRecord;

    get isActive() {
        return getFieldValue(this.productRecord.data, ACTIVE_FIELD);
    }

    get imageUrl() {
        const imageId = getFieldValue(this.productRecord.data, IMAGE_ID_FIELD);
        return imageId ? `/sfc/servlet.shepherd/document/download/${imageId}` : null;
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                PRODUCT_SELECTED_CHANNEL,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    handleMessage(message) {
        if (message && message.productId) {
            this.productId = message.productId;
            if (message.action === 'refresh') {
                const historyEl = this.template.querySelector('c-product-price-history');
                if (historyEl) {
                    historyEl.refresh();
                }
            }
        }
    }
}
