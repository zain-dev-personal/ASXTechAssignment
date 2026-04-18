trigger ProductTrigger on Product__c (after update) {
    if (Trigger.isAfter && Trigger.isUpdate) {
        ProductTriggerHandler.handleAfterUpdate(Trigger.newMap, Trigger.oldMap);
    }
}
