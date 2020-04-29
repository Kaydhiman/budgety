
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

    var calculateData = function(type) {
        var sum = 0;

        data[type].forEach(curr => {
            sum += curr.value;
        });

        data.total[type] = sum;
    }

    var data = {
        inc: [],
        exp: [],
        total: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1
    }

    return {
        addNewItem: function(obj) {
            var item, id;

            if(data[obj.type].length > 0) {
                id = data[obj.type][data[obj.type].length - 1].id + 1;
            } else {
                id = 0;
            }

            if(obj.type === 'inc') {
                item = new Income(id, obj.type, obj.description, obj.value);
            } else if(obj.type === 'exp') {
                item = new Expense(id, obj.type, obj.description, obj.value);
            }

            data[obj.type].push(item);
        },

        calculateBudget: function() {
            calculateData('inc');
            calculateData('exp');

            data.budget = data.total.inc - data.total.exp;

            data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.total.inc,
                totalExp: data.total.exp,
                percentage: data.percentage
            }
        },

        test: function() {
            console.log(data);
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
        expensesList: document.querySelector('.expenses__list'),
        budgetLabel: document.querySelector('.budget__value'),
        incomeLabel: document.querySelector('.budget__income--value'),
        expenseLabel: document.querySelector('.budget__expenses--value'),
        percentageLabel: document.querySelector('.budget__expenses--percentage')
    }


    return {
        getDOMelements: function() {
            return DOMelements;
        },

        getInputs: function() {
            return {
                value: parseFloat(DOMelements.budgetValue.value),
                description: DOMelements.budgetDecription.value,
                type: DOMelements.budgetType.value
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
        },

        updateBudget: function(obj) {
            DOMelements.budgetLabel.textContent = obj.budget;
            DOMelements.incomeLabel.textContent = obj.totalInc;
            DOMelements.expenseLabel.textContent = obj.totalExp;
            
            if(obj.percentage >= 0) {
                DOMelements.percentageLabel.textContent = obj.percentage + '%';
            } else {
                DOMelements.percentageLabel.textContent = '---';
            }
        }
    }

})();


//global controller
var controller = (function(budgetCntrl, UIcntrl) {

    // Even Listener Controler
    var crtEventListners = function() {
        var DOM = UIcntrl.getDOMelements();

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

        // calculate budget
        budgetCntrl.calculateBudget()

        // get budget
        var budget = budgetCntrl.getBudget();

        // update budget to UI
        UIcntrl.updateBudget(budget);

        // clear input fields
        UIcntrl.clearInputs();
    }

    return {
        init: function() {
            crtEventListners();

            UIcntrl.updateBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
        }
    }
    
})(budgetController, UIcontroller);

// app initial state
controller.init();