new Vue({
  el: '#app',
  data: {
      sitename: 'Business Calculator',
      products: [],
      margins: [],
      sort: {
          tag: 'id',
          direction: true
      },
      keys: [
          'id',
          'name',
          'cost',
          'sell',
          'units'
      ],
      searchQuery: '',
      calculations: false,
      defaultProduct: {
          cost: 10,
          sell: 30,
          units: 50
      },
      defaultMarginCost: 10
  },
  computed: {
      productsList() {
          let list = []
          if(this.searchQuery) {
            const searchLower = this.searchQuery.toLowerCase();
            for (let i = 0; i < this.products.length; i++) {
                const product = this.products[i];
                const idString = product.id.toString();
                const costString = product.cost.toString();
                const sellString = product.sell.toString();
                const unitsString = product.units.toString();
                // Check if the subject title or location matches the search input
                if (idString.includes(searchLower) || product.name.toLowerCase().includes(searchLower) ||
                  costString.includes(searchLower) || sellString.includes(searchLower) || 
                  unitsString.includes(searchLower)
                ) {
                  list.push(product);
                }
            }
          }
          else {
            list = this.products.slice();
          }
          // Sort without mutating the original array
          list.sort((a, b) => {
            let result = 0;
            if (a[this.sort.tag] > b[this.sort.tag]) {
                result = 1;
            } else if (a[this.sort.tag] < b[this.sort.tag]) {
                result = -1;
            }
    
            // Reverse the order if sort.direction is false
            return this.sort.direction ? result : -result;
          });
    
          return list;
      },
  },
  methods: {
      addProduct() {
          let index = this.products.length ? Number(this.products[this.products.length - 1].id) + 1 : 1;
          const newProduct = {
              id: index,
              name: 'Product-'+index,
              cost: this.defaultProduct.cost,
              sell: this.defaultProduct.sell,
              units: this.defaultProduct.units,
              more: false
          };
          this.products.push(newProduct);
      },
      showMore(product) {
          product.more = !product.more;
      },
      totalCost(element) {
          let cost = element.cost * element.units
          let sell = element.sell * element.units
          return {cost, sell};
      },
      applySort(tag) {
          this.sort.tag = tag;
          this.sort.direction = !this.sort.direction;
      },
      addMargin() {
          let index = this.margins.length ? Number(this.margins[this.margins.length - 1].id) + 1 : 1;
          const newMargin = {
            id: index,
            name: 'Margin-'+index,
            type: 'fixed',
            cost: this.defaultMarginCost,
          };
          this.margins.push(newMargin);
      },
      // Removes product or margin
      removeElement(element, section) {
          if (section == 'products') {
            const index = this.products.findIndex(p => p.id === element.id);
            if (index !== -1) {
              this.products.splice(index, 1);
            }
          }
          if (section == 'margins') {
            const index = this.margins.findIndex(m => m.id === element.id);
            if (index !== -1) {
              this.margins.splice(index, 1);
            }
          }
      },
      // Calculations
      showCalculations() {
        this.calculations = this.products.length && this.margins.length;
      },
      allProductsPrices() {
        var cost = 0
        var sell = 0
        this.products.forEach(element => {
          cost += this.totalCost(element).cost
          sell += this.totalCost(element).sell
        });
        return {cost, sell};
      },
      allMarginsCost() {
        var cost = 0
        this.margins.forEach(element => {
          cost += element.cost
        });
        return {cost}
      },
      grossProfit() {
        var value = 0
        value = this.allProductsPrices().sell - this.allProductsPrices().cost
        return value;
      },
      netProfit() {
        var value = 0
        value = this.grossProfit() - this.allMarginsCost().cost
        return value;
      },
      profitMargin() {
        var value = 0
        value += (this.netProfit() / this.allProductsPrices().sell) * 100
        return value;
      },
      totalFixedCosts() {
        var cost = 0
        this.margins.forEach(element => {
          if(element.type == 'fixed') cost += element.cost
        });
        return {cost};
      },
      breakEvenUnits(element) {
        if (element.sell <= element.cost) return { units: Infinity };
        return { units: this.totalFixedCosts().cost / (element.sell - element.cost) };
      },
      roi() {
        var value = 0
        var totalInvestments = this.allProductsPrices().cost + this.totalFixedCosts().cost
        value = (this.netProfit() /  totalInvestments) * 100
        return value;
      },
  },
})