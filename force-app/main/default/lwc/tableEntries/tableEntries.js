import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createEvents from '@salesforce/apex/TimeEntriesHelper.createEvents';


export default class TableEntries extends LightningElement {



    rows = [{ rowNumber: 1, hoursWorked: 0, Subject: '', CaseId: '' }];

    taskValue = "Training";
    caseworkValue = "Verify Annuity Contract details";


    connectedCallback() {
        let _startDate = new Date();
        let _endDate = new Date(_startDate.setHours(_startDate.getHours() + 1));
        console.log(_endDate);
        this.rows[0].StartDateTime = _startDate;
        this.rows[0].EndDateTime = _endDate;
        this.rows = JSON.parse(JSON.stringify(this.rows));
    }

    get taskOptions() {
        return [
            { label: 'Vacation Day', value: 'Vacation Day' },
            { label: 'Break', value: 'Break' },
            { label: 'Personal Appointment', value: 'Personal Appointment' },
            { label: 'Lunch', value: 'Lunch' },
            { label: 'Training', value: 'Training' },
            { label: 'Team Meeting', value: 'Team Meeting' },
            { label: 'Other', value: 'Other' },
        ];
    }

    get caseworkOptions() {
        return [
            { label: 'Information collection', value: 'Information collection' },
            { label: 'Verify Life Policy details', value: 'Verify Life Policy details' },
            { label: 'Verify Annuity Contract details', value: 'Verify Annuity Contract details' },
            { label: 'Document request – customer', value: 'Document request – customer' },
            { label: 'Document request – internal', value: 'Document request – internal' },
            { label: 'Waiting for approval', value: 'Waiting for approval' },
            { label: 'Customer communications', value: 'Customer communications' },
        ];
    }


    handleAdd() {
        let _startDate = new Date();
        let _endDate = new Date(_startDate.setHours(_startDate.getHours() + 1));
        if (this.rows.length > 0)
            this.rows.push({ rowNumber: this.rows[this.rows.length - 1].rowNumber + 1, hoursWorked: 0, Subject: '', CaseId: '', StartDateTime: _startDate, EndDateTime: _endDate });
        else
            this.rows.push({ rowNumber: 1, hoursWorked: 0, Subject: '', StartDateTime: _startDate, EndDateTime: _endDate });
        this.rows = JSON.parse(JSON.stringify(this.rows));
    }

    handleSelection(event) {
        if (event.detail.selectedRecordId) {
            if (event.detail.selectedRecordId.startsWith('500')) {
                this.rows = this.rows.map(item => {
                    if (item.rowNumber === event.detail.row) {
                        item.CaseId = event.detail.selectedRecordId;
                        return item;
                    } else {
                        return item;
                    }
                })
            }
            else {
                this.rows = this.rows.map(item => {
                    if (item.rowNumber === event.detail.row) {
                        item.ContactId = event.detail.selectedRecordId;
                        return item;
                    } else {
                        return item;
                    }
                })
            }
        }
    }

    handleTaskChange(event) {
        let value = event.detail.value;
        console.log(value);
        this.rows = this.rows.map(item => {
            if (item.rowNumber == event.target.dataset.row) {
                console.log('in If');
                item.Subject = item.Subject + value;
                return item;
            } else {
                return item;
            }
        })
    }

    handleCaseWorkChange(event) {
        let row = event.target.dataset.row;
        let value = event.detail.value;
        this.rows = this.rows.map(item => {
            if (item.rowNumber == row) {
                item.Subject = item.Subject + '-' + value;
                return item;
            } else {
                return item;
            }
        })
    }

    handleStartDateChange(event) {
        let row = event.target.dataset.row;
        let value = event.target.value;
        this.rows = this.rows.map(item => {
            if (item.rowNumber == row) {
                item.StartDateTime = value;
                return item;
            } else {
                return item;
            }
        })
    }

    handleEndDateChange(event) {
        let row = event.target.dataset.row;
        let value = event.target.value;
        this.rows = this.rows.map(item => {
            if (item.rowNumber == row) {
                item.EndDateTime = value;
                return item;
            } else {
                return item;
            }
        })
    }
    handleSave() {
        let promises = this.rows.map(item => {
            return createEvents({ subject: item.Subject, startDate: item.StartDateTime, endDate: item.EndDateTime, caseId: item.CaseId });
        })

        Promise.all(promises).then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Events Successfully Added to your Calendar!',
                    variant: 'success',
                }),
            );
        })

        //console.log(this.rows);
    }

    handleDelete(event) {
        let rowNumber = event.target.dataset.row;
        //console.log(rowNumber);
        this.rows = this.rows.filter(item => item.rowNumber != rowNumber);
        this.rows = JSON.parse(JSON.stringify(this.rows));
        console.log(this.rows);
    }


}