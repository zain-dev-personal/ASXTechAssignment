import { LightningElement, wire, track } from 'lwc';
import getProducts from '@salesforce/apex/ProductController.getProducts';
import updateProductStatus from '@salesforce/apex/ProductController.updateProductStatus';
import { deleteRecord, notifyRecordUpdateAvailable } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import LightningConfirm from 'lightning/confirm';
import PRODUCT_OBJECT from '@salesforce/schema/Product__c';
import CATEGORY_FIELD from '@salesforce/schema/Product__c.Category__c';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';

// LMS
import { MessageContext, publish } from 'lightning/messageService';
import PRODUCT_SELECTED_CHANNEL from '@salesforce/messageChannel/ProductSelected__c';
import IMAGE_ID_FIELD from '@salesforce/schema/Product__c.Product_Image_Id__c';
import { updateRecord } from 'lightning/uiRecordApi';

const COLUMNS = [
    { label: 'Name', fieldName: 'Name', sortable: true },
    { label: 'Category', fieldName: 'Category__c' },
    {
        label: 'Price',
        fieldName: 'Unit_Price__c',
        type: 'currency',
        sortable: true,
        typeAttributes: { currencyCode: 'AUD', step: '0.01' }
    },
    {
        label: 'Active',
        type: 'inlineToggle',
        typeAttributes: {
            recordId: { fieldName: 'Id' },
            checked: { fieldName: 'Active__c' }
        }
    },
    {
        type: 'button-icon',
        initialWidth: 50,
        typeAttributes: {
            iconName: 'utility:preview',
            name: 'view',
            title: 'View Detail',
            variant: 'bare',
            alternativeText: 'View'
        }
    },
    {
        type: 'button-icon',
        initialWidth: 50,
        typeAttributes: {
            iconName: 'utility:edit',
            name: 'edit',
            title: 'Edit',
            variant: 'bare',
            alternativeText: 'Edit'
        }
    },
    {
        type: 'button-icon',
        initialWidth: 50,
        typeAttributes: {
            iconName: 'utility:delete',
            name: 'delete',
            title: 'Delete',
            variant: 'bare',
            alternativeText: 'Delete'
        }
    }
];

export default class ProductCatalogue extends LightningElement {
    @track products = [];
    @track filteredProducts = [];
    @track selectedCategory = '';
    @track includeInactive = false;
    @track viewMode = 'list'; // 'list' or 'card'
    @track sortBy = 'Name';
    @track sortDirection = 'asc';

    @track isEditing = false;
    @track isCreating = false;
    @track isCreatingStep2 = false;
    @track editRecordId = null;

    wiredProductsResult;

    get acceptedFormats() {
        return ['.jpg', '.png', '.jpeg'];
    }
    columns = COLUMNS;
    error;

    @track categoryOptions = [{ label: 'All', value: '' }];

    @wire(MessageContext)
    messageContext;

    @wire(getObjectInfo, { objectApiName: PRODUCT_OBJECT })
    productMetadata;

    @wire(getPicklistValues, {
        recordTypeId: '$productMetadata.data.defaultRecordTypeId',
        fieldApiName: CATEGORY_FIELD
    })
    wiredCategoryValues({ error, data }) {
        if (data) {
            this.categoryOptions = [
                { label: 'All', value: '' },
                ...data.values.map(item => ({ label: item.label, value: item.value }))
            ];
        } else if (error) {
            console.error('Error fetching categories: ', error);
        }
    }

    @wire(getProducts, { categoryValue: '$selectedCategory', includeInactive: '$includeInactive' })
    wiredProducts(result) {
        this.wiredProductsResult = result;
        const { data, error } = result;
        if (data) {
            this.products = data.map(item => ({
                ...item,
                activeIcon: item.Active__c ? 'utility:check' : 'utility:close',
                activeClass: item.Active__c ? 'slds-text-color_success' : 'slds-text-color_error',
                imageUrl: item.Product_Image_Id__c ? `/sfc/servlet.shepherd/document/download/${item.Product_Image_Id__c}` : null
            }));
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.products = [];
            this.showToast('Error', 'Error fetching products', 'error');
        }
    }

    get isListView() {
        return this.viewMode === 'list';
    }

    get isCardView() {
        return this.viewMode === 'card';
    }

    get hasProducts() {
        return this.products && this.products.length > 0;
    }

    handleCategoryChange(event) {
        this.selectedCategory = event.detail.value;
    }

    handleInactiveToggle(event) {
        this.includeInactive = event.target.checked;
    }

    handleViewChange(event) {
        this.viewMode = event.target.value;
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        if (actionName === 'view') {
            this.publishSelectedProduct(row.Id);
        } else if (actionName === 'edit') {
            this.openEditModal(row.Id);
        } else if (actionName === 'delete') {
            this.deleteProduct(row.Id);
        }
    }

    handleInlineToggle(event) {
        const recordId = event.detail.recordId;
        const newStatus = event.detail.status;
        this.toggleActiveStatus(recordId, newStatus);
    }

    handleCardAction(event) {
        const action = event.currentTarget.dataset.action;
        const recordId = event.currentTarget.dataset.id;

        if (action === 'view') {
            this.publishSelectedProduct(recordId);
        } else if (action === 'edit') {
            this.openEditModal(recordId);
        } else if (action === 'delete') {
            this.deleteProduct(recordId);
        }
    }

    openEditModal(recordId) {
        this.editRecordId = recordId;
        this.isEditing = true;
    }

    closeEditModal() {
        this.isEditing = false;
        this.editRecordId = null;
    }

    handleEditSuccess() {
        const savedRecordId = this.editRecordId;
        this.showToast('Success', 'Product updated successfully', 'success');
        this.closeEditModal();
        notifyRecordUpdateAvailable([{ recordId: savedRecordId }]);
        publish(this.messageContext, PRODUCT_SELECTED_CHANNEL, { productId: savedRecordId, action: 'refresh' });
        return refreshApex(this.wiredProductsResult);
    }

    handleNewProduct() {
        this.isCreating = true;
        this.isCreatingStep2 = false;
        this.editRecordId = null;
    }

    closeCreateModal() {
        this.isCreating = false;
        this.isCreatingStep2 = false;
        if (this.editRecordId && !this.isEditing) {
            refreshApex(this.wiredProductsResult);
        }
        this.editRecordId = null;
    }

    handleCreateSuccess(event) {
        this.showToast('Success', 'Product details saved. Now upload an image.', 'success');
        this.editRecordId = event.detail.id;
        this.isCreatingStep2 = true;
    }

    handleCreateUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        if (uploadedFiles.length > 0) {
            const documentId = uploadedFiles[0].documentId;
            const fields = {};
            fields['Id'] = this.editRecordId;
            fields[IMAGE_ID_FIELD.fieldApiName] = documentId;

            const recordInput = { fields };

            updateRecord(recordInput)
                .then(() => {
                    this.showToast('Success', 'Image saved to product', 'success');
                    notifyRecordUpdateAvailable([{ recordId: this.editRecordId }]);
                    this.closeCreateModal();
                })
                .catch(error => {
                    this.showToast('Error', 'Failed to link image: ' + error.body.message, 'error');
                });
        }
    }

    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        if (uploadedFiles.length > 0) {
            const documentId = uploadedFiles[0].documentId;
            const fields = {};
            fields['Id'] = this.editRecordId;
            fields[IMAGE_ID_FIELD.fieldApiName] = documentId;

            const recordInput = { fields };

            updateRecord(recordInput)
                .then(() => {
                    this.showToast('Success', 'Image uploaded and linked successfully', 'success');
                    notifyRecordUpdateAvailable([{ recordId: this.editRecordId }]);
                    return refreshApex(this.wiredProductsResult);
                })
                .catch(error => {
                    this.showToast('Error', 'Image upload failed to link: ' + error.body.message, 'error');
                });
        }
    }

    async deleteProduct(recordId) {
        const result = await LightningConfirm.open({
            message: 'Are you sure you want to delete this product? All unarchived history will be lost.',
            variant: 'header',
            label: 'Confirm Deletion',
            theme: 'error'
        });

        if (result) {
            deleteRecord(recordId)
                .then(() => {
                    this.showToast('Success', 'Product deleted successfully', 'success');
                    return refreshApex(this.wiredProductsResult);
                })
                .catch(error => {
                    this.showToast('Error', error.body.message || 'Error deleting product', 'error');
                });
        }
    }

    publishSelectedProduct(recordId) {
        const payload = { productId: recordId };
        publish(this.messageContext, PRODUCT_SELECTED_CHANNEL, payload);
    }

    handleToggleCard(event) {
        const productId = event.target.dataset.id;
        const currentStatus = event.target.checked;
        this.toggleActiveStatus(productId, currentStatus);
    }

    toggleActiveStatus(productId, newStatus) {
        updateProductStatus({ productId, isActive: newStatus })
            .then(() => {
                this.showToast('Success', 'Product status updated', 'success');
                notifyRecordUpdateAvailable([{ recordId: productId }]);
                return refreshApex(this.wiredProductsResult);
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }

    handleSort(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }

    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.products));
        let keyValue = (a) => {
            return a[fieldname];
        };
        let isReverse = direction === 'asc' ? 1 : -1;
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : '';
            y = keyValue(y) ? keyValue(y) : '';
            return isReverse * ((x > y) - (y > x));
        });
        this.products = parseData;
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant
            })
        );
    }
}
