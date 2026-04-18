public with sharing class ProductTriggerHandler {
    
    /**
     * @description Handles the after update event to track price changes.
     * @param newMap Map of new product records.
     * @param oldMap Map of old product records.
     */
    public static void handleAfterUpdate(Map<Id, Product__c> newMap, Map<Id, Product__c> oldMap) {
        List<Price_History__c> historiesToInsert = new List<Price_History__c>();
        
        for (Product__c newProd : newMap.values()) {
            Product__c oldProd = oldMap.get(newProd.Id);
            
            // Check if price has changed
            if (newProd.Unit_Price__c != oldProd.Unit_Price__c) {
                historiesToInsert.add(new Price_History__c(
                    Product__c = newProd.Id,
                    Old_Price__c = oldProd.Unit_Price__c,
                    New_Price__c = newProd.Unit_Price__c,
                    Date_Changed__c = System.now()
                ));
            }
        }
        
        // Bulkified DML outside of the loop
        if (!historiesToInsert.isEmpty()) {
            insert historiesToInsert;
        }
    }
}
