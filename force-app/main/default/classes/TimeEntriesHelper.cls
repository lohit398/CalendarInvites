public class TimeEntriesHelper {
    public static DateTime convert(String dateTimeValue){
        String d1 = dateTimeValue;
        list<String> d2 = d1.split('-');
        list<integer> timeComponent = new list<integer>();
        
        timeComponent.add(Integer.valueOf(d2[0]));
        timeComponent.add(Integer.valueOf(d2[1]));
        timeComponent.add(Integer.valueOf(d2[2].left(2)));
        
        String t = d2[2].substringBetween('T','.');
        
        list<String> time1 = t.split(':');
        timeComponent.add(Integer.valueOf(time1[0]));
        timeComponent.add(Integer.valueOf(time1[1]));
        timeComponent.add(Integer.valueOf(time1[2]));
        
        Datetime dt = Datetime.newInstance(timeComponent[0],
                                           timeComponent[1],
                                           timeComponent[2],
                                           timeComponent[3],
                                           timeComponent[4],
                                           timeComponent[5]);
        return dt;
    }
    
    
    @AuraEnabled
    public static Integer createEvents(String subject,String startDate,String endDate,String caseId){
        Event evt = new Event();
        evt.Subject = subject;
        evt.StartDateTime = TimeEntriesHelper.convert(startDate);
        evt.EndDateTime = TimeEntriesHelper.convert(endDate);
        evt.WhatId = caseId;
        evt.WhoId = [SELECT ContactId FROM Case WHERE Id = :caseId].ContactId;
        INSERT evt;
        return 1;
    }
    
    @AuraEnabled(cacheable=true)
    public static String getContactId(String caseId){
        return [SELECT ContactId FROM Case WHERE Id = :caseId].ContactId;
    }
}