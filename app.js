
//budget controller
var budgetController = (function() {

    var Income = function(id, type, description, value) {
        this.id = id;
        this.type = type;
        this.description = description;
        this.value = value;
    }

    var Expense = function(id, type, description, value) {
        this.id = id;
        this.type = type;
        this.description = description;
        this.value = value;
    }

    return {
        data: {
            inc: [],
            exp: [],
            total: {
                totalInc: 0,
                totalExp: 0
            },
            budget: 0
        },

        addNewItem: function(obj) {
            var item, id;

            if(budgetController.data[obj.type].length > 0) {
                id = budgetController.data[obj.type][budgetController.data[obj.type].length - 1].id + 1;
            } else {
                id = 0;
            }

            if(obj.type === 'inc') {
                item = new Income(id, obj.type, obj.description, obj.value);
            } else if(obj.type === 'exp') {
                item = new Expense(id, obj.type, obj.description, obj.value);
            }

            budgetController.data[obj.type].push(item);
        }
    }

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
        },
        addListItem: function(obj) {
            var html;

            if(obj.type === 'inc') {
                html = `<div class="item clearfix" id="inc-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">${obj.value}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;

                DOMelements.incomeList.insertAdjacentHTML('beforeend', html)


            } else if(obj.type === 'exp') {
                html = `<div class="item clearfix" id="exp-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">${obj.value}</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;

                DOMelements.expensesList.insertAdjacentHTML('beforeend', html)
            }


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
        var inputs, item;

        // get imputs data
        inputs = UIcntrl.getInputs();

        if( inputs.description.length > 0 && !isNaN(inputs.value )) {
            // create new item according there type
            item = budgetCntrl.addNewItem(inputs);

            // add new list item to UI
            UIcntrl.addListItem(inputs);
        }

        // clear input fields
        UIcntrl.clearInputs();
    }

    return {
        init : function() {
            crtEventListners();
        }
    }
    
})(budgetController, UIcontroller);


controller.init();