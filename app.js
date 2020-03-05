
//budget controller
var budgetController = (function() {

    //some code...

})();



//UI controller
var UIcontroller = (function() {

    var DOMstrings = {
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
        DOMstrngs: DOMstrings
    }

})();


//global controller
var controller = (function(budgetCntrl, UIcntrl) {

    var DOM = UIcntrl.DOMstrngs;

    var addValue = function() {
        var value = parseInt(DOM.budgetValue.value);
        var description = DOM.budgetDecription.value;
        var type = DOM.budgetType.value;

        var income, expenses = 0;

        if(type === 'inc' ) {
            income += value;
            DOM.budgetIncomeValue.textContent = income;

            DOM.incomeList.insertAdjacentHTML('beforeend', '<div class="item clearfix" id="income-0"><div class="item__description">'+ description +'</div><div class="right clearfix"><div class="item__value">+ '+ value +'</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>')
        }

        if(type === 'exp' ) {
            expenses += value;
            DOM.budgetExpenses.textContent = expenses;

            DOM.expensesList.insertAdjacentHTML('beforeend', '<div class="item clearfix" id="expense-0"><div class="item__description">'+ description +'</div><div class="right clearfix"><div class="item__value">- '+ value +'</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>')
        }
    }

    DOM.addBtn.addEventListener('click', addValue);

    document.addEventListener('keypress', function(e) {

        if(e.keyCode === 13) {
            addValue();
        }
    });


})(budgetController, UIcontroller);


