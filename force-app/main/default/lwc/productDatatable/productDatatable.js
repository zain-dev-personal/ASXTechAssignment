import LightningDatatable from 'lightning/datatable';
import toggleTemplate from './toggleTemplate.html';

export default class ProductDatatable extends LightningDatatable {
    static customTypes = {
        inlineToggle: {
            template: toggleTemplate,
            standardCellLayout: true,
            typeAttributes: ['recordId', 'checked']
        }
    };
}
