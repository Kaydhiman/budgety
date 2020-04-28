
//budget controller
var budgetController = (function() {


})();



//UI controller
var UIcontroller = (function() {

    var DOMelements = {
        addBtn: document.querySelector('.add__btn'),
        budgetValue: document.querySelector('.add__value'),
        budgetDecription: document.querySelector('.add__description'),
        budgetType: document.querySelector('.add__type'),
        budgetIncomeValue: document.querySelector('.budget__income--value'),
        budgetExpenses: document.querySelector('.budget__expenses--value'),
        incomeList: document.querySelector('.income__list'),
        expensesList: document.querySelector('.expenses__list')
    }


    return {
        DOMelements: DOMelements,
        getInputs: function() {
            return {
                value : parseFloat(DOMelements.budgetValue.value),
                description : DOMelements.budgetDecription.value,
                type : DOMelements.budgetType.value
            }
        },
        clearInputs : function() {
            DOMelements.budgetValue.value = '';
            DOMelements.budgetDecription.value = '';
            DOMelements.budgetDecription.focus();
        }
    }

})();


//global controller
var controller = (function(budgetCntrl, UIcntrl) {

    // Even Listener Controler
    var crtEventListners = function() {
        var DOM = UIcntrl.DOMelements;

        DOM.addBtn.addEventListener('click', ctrAddItem);

        document.addEventListener('keypress', function(e) {
            if(e.keyCode === 13) {
                ctrAddItem();
            }
        });
    }


    // Add new item
    var ctrAddItem = function() {

        // get imputs data
        var inputs = UIcntrl.getInputs();

        console.log(inputs)

        // clear input fields
        UIcntrl.clearInputs()
    }

    return {
        init : function() {
            crtEventListners();
            console.log('app started')
        }
    }
})(budgetController, UIcontroller);


controller.init();