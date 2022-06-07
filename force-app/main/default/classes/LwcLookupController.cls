public without sharing class LwcLookupController {
    @AuraEnabled(cacheable=true)  
   public static List<sobject> findRecords(String searchKey, String objectName) {  
     string searchText = '\'' + String.escapeSingleQuotes(searchKey) + '%\'';  
     string query = 'SELECT Id, Name FROM ' +objectName+ ' WHERE Name LIKE '+searchText+' LIMIT 6';
     if(objectName != 'Case')
     	return Database.query('SELECT Id, Name FROM ' +objectName+ ' WHERE Name LIKE '+searchText+' LIMIT 6');  
      else
         return Database.query('SELECT Id,CaseNumber FROM '+objectName+' WHERE CaseNumber LIKE '+searchText+' LIMIT 6');
   }  
}