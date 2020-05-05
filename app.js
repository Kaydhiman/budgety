
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
        this.percentage = -1;
    }

    Expense.prototype.calcPercentage = function(totalIcome) {
        this.percentage = (this.value / totalIcome) *  100;
    }

    Expense.prototype.getPercentage = function() {
        return this.percentage;
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

            return item
        },

        calculateBudget: function() {
            calculateData('inc');
            calculateData('exp');

            data.budget = data.total.inc - data.total.exp;

            if(data.total.inc !== 0) {
                data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
            } else {
                data.percentage = '---';
            }

        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.total.inc,
                totalExp: data.total.exp,
                percentage: data.percentage
            }
        },

        calculatePercentage: function() {
            data.exp.forEach(function(curr) {
                curr.calcPercentage(data.total.inc);
            });
        },

        getPercentage: function() {
            var percentages = data.exp.map(function(curr) {
                return Math.round(curr.percentage);
            });

            return percentages;
        },

        deleteItem: function(type, id) {

            data[type].forEach(function(curr, ind) {
               if(curr.id === id) {
                   data[type].splice(ind, 1);
               }
            });

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
        percentageLabel: document.querySelector('.budget__expenses--percentage'),
        container: document.querySelector('.container'),
        itemsPercentageLabels: '.item__percentage',
        monthLable: document.querySelector('.budget__title--month')
    }

    var nodeListForEch = function(listNode, callBack) {
        for(var i = 0; i < listNode.length; i++) {
            callBack(listNode[i], i);
        }
    }

    var styleNumbers = function(num, type) {
        var splittedNumber, int, dec, newNumber, sign;

        num = Math.abs(num);

        num = num.toFixed(2);

        splittedNumber = num.split('.');

        int = splittedNumber[0];
        dec = splittedNumber[1];

        if(int.length > 3) {
            newNumber = []; 
            int.split('').reverse().forEach(function(curr, index) {
                if(index % 3 === 0 && index !== 0) {
                    newNumber.push(',')
                }
                newNumber.push(curr);
            });

            newNumber = newNumber.reverse().join('');
        } else {
            newNumber = int;
        }

        if(type === 'inc') {
            sign = '+ '
        } else if(type === 'exp') {
            sign = '- '
        }

        return sign + newNumber + '.' + dec;
    }


    var getCurrentMonthYear = function() {
        var now, month, year, months;

        now = new Date();
        month = now.getMonth();
        year = now.getFullYear();

        months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        return months[month] + ', ' + year;

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
                html = `<div class="item clearfix" id="inc-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">${styleNumbers(obj.value, obj.type)}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;

                DOMelements.incomeList.insertAdjacentHTML('beforeend', html)

            } else if(obj.type === 'exp') {
                html = `<div class="item clearfix" id="exp-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">${styleNumbers(obj.value, obj.type)}</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;

                DOMelements.expensesList.insertAdjacentHTML('beforeend', html)
            }
        },

        removeListItem: function(selectorId) {
            var el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);
        },

        updateBudget: function(obj) {
            DOMelements.budgetLabel.textContent = obj.totalInc >= obj.totalExp ? styleNumbers(obj.budget, 'inc'): styleNumbers(obj.budget, 'exp');
            DOMelements.incomeLabel.textContent = styleNumbers(obj.totalInc, 'inc');
            DOMelements.expenseLabel.textContent = styleNumbers(obj.totalExp, 'exp');

            if(obj.percentage >= 0) {
                DOMelements.percentageLabel.textContent = obj.percentage + '%';
            } else {
                DOMelements.percentageLabel.textContent = '---';
            }
        },

        updateItemPercentage: function(list) {
            var labelsList = document.querySelectorAll(DOMelements.itemsPercentageLabels);

            nodeListForEch(labelsList, function(curr, index) {
                curr.textContent = list[index] + '%';
            });
        },

        updateMonthYear: function() {
            DOMelements.monthLable.textContent = getCurrentMonthYear();
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

        DOM.container.addEventListener('click', ctrDeleteItem);
    }


    var ctrUpdateBudget = function() {
        // calculate budget
        budgetCntrl.calculateBudget()

        // get budget
        var budget = budgetCntrl.getBudget();

        // update budget to UI
        UIcntrl.updateBudget(budget);
    }

    var ctrUpdatePercentage = function() {
        // calculate percentage
        budgetCntrl.calculatePercentage();

        // get percentages
        var percentages = budgetCntrl.getPercentage();

        // update percentages to UI
        UIcntrl.updateItemPercentage(percentages);

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
            UIcntrl.addListItem(item);
        }

        // update budget
        ctrUpdateBudget();

        // update percentegae
        ctrUpdatePercentage();

        // clear input fields
        UIcntrl.clearInputs();
    }


    var ctrDeleteItem = function(e) {
        if(e.target.classList.value === 'ion-ios-close-outline') {
            var selectedEleId = e.target.parentNode.parentNode.parentNode.parentNode.id;

            if(selectedEleId) {
                var splitedId, type, id;
                
                splitedId = selectedEleId.split('-');

                type = splitedId[0];

                id = parseInt(splitedId[1]);

                // delete item from budget controller
                budgetCntrl.deleteItem(type, id);

                // delete item from UI
                UIcntrl.removeListItem(selectedEleId);
                        
                // update budget
                ctrUpdateBudget();

                // update percentegae
                ctrUpdatePercentage();

            }

        }
    }

    return {
        init: function() {
            crtEventListners();
            UIcntrl.updateMonthYear();

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