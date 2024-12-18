new Vue({
  el: '#app',
  data: {
      // App title
      sitename: 'Business Calculator',

      // Arrays to store products and margins
      products: [],
      margins: [],

      // Default sorting configuration
      sort: {
          tag: 'id',
          direction: true
      },

      // Sortable keys for products
      keys: [
          'id',
          'name',
          'cost',
          'sell',
          'units'
      ],

      // Search query input
      searchQuery: '',

      // Toggle for showing calculations
      calculations: false,

      // Default values for new products and margins
      defaultProduct: {
          cost: 10,
          sell: 30,
          units: 50
      },
      defaultMarginCost: 10
  },

  computed: {
      // Returns the filtered and sorted list of products
      productsList() {
          let list = [];
          if (this.searchQuery) {
              const searchLower = this.searchQuery.toLowerCase();
              for (let i = 0; i < this.products.length; i++) {
                  const product = this.products[i];
                  const idString = product.id.toString();
                  const costString = product.cost.toString();
                  const sellString = product.sell.toString();
                  const unitsString = product.units.toString();

                  // Check if any product fields match the search input
                  if (idString.includes(searchLower) || product.name.toLowerCase().includes(searchLower) ||
                      costString.includes(searchLower) || sellString.includes(searchLower) || 
                      unitsString.includes(searchLower)
                  ) {
                      list.push(product);
                  }
              }
          } else {
              list = this.products.slice();
          }

          // Sort the list without mutating the original array
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
      // Adds a new product to the products array
      addProduct() {
          let index = this.products.length ? Number(this.products[this.products.length - 1].id) + 1 : 1;
          const newProduct = {
              id: index,
              name: 'Product-' + index,
              cost: this.defaultProduct.cost,
              sell: this.defaultProduct.sell,
              units: this.defaultProduct.units,
              more: false
          };
          this.products.push(newProduct);
      },

      // Toggles additional product details
      showMore(product) {
          product.more = !product.more;
      },

      // Calculates total cost and total selling price for a product
      totalCost(element) {
          let cost = element.cost * element.units;
          let sell = element.sell * element.units;
          return { cost, sell };
      },

      // Applies sorting based on the selected key
      applySort(tag) {
          this.sort.tag = tag;
          this.sort.direction = !this.sort.direction;
      },

      // Adds a new margin to the margins array
      addMargin() {
          let index = this.margins.length ? Number(this.margins[this.margins.length - 1].id) + 1 : 1;
          const newMargin = {
              id: index,
              name: 'Margin-' + index,
              type: 'fixed',
              cost: this.defaultMarginCost,
          };
          this.margins.push(newMargin);
      },

      // Removes an element (product or margin) based on the section
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

      // Shows calculations if both products and margins exist
      showCalculations() {
          this.calculations = this.products.length && this.margins.length;
      },

      // Calculates the total cost and selling price for all products
      allProductsPrices() {
          let cost = 0;
          let sell = 0;
          this.products.forEach(element => {
              cost += this.totalCost(element).cost;
              sell += this.totalCost(element).sell;
          });
          return { cost, sell };
      },

      // Calculates the total cost for all margins
      allMarginsCost() {
          let cost = 0;
          this.margins.forEach(element => {
              cost += element.cost;
          });
          return { cost };
      },

      // Calculates gross profit (before margins)
      grossProfit() {
          return this.allProductsPrices().sell - this.allProductsPrices().cost;
      },

      // Calculates net profit (after deducting margins)
      netProfit() {
          return this.grossProfit() - this.allMarginsCost().cost;
      },

      // Calculates profit margin percentage
      profitMargin() {
          return (this.netProfit() / this.allProductsPrices().sell) * 100;
      },

      // Calculates total fixed costs from margins
      totalFixedCosts() {
          let cost = 0;
          this.margins.forEach(element => {
              if (element.type == 'fixed') cost += element.cost;
          });
          return { cost };
      },

      // Calculates the break-even point for a product
      breakEvenUnits(element) {
          if (element.sell <= element.cost) return { units: Infinity };
          return { units: this.totalFixedCosts().cost / (element.sell - element.cost) };
      },

      // Calculates return on investment (ROI) percentage
      roi() {
          let totalInvestments = this.allProductsPrices().cost + this.totalFixedCosts().cost;
          return (this.netProfit() / totalInvestments) * 100;
      },
  },
})