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
            'batch'
        ],
        searchQuery: '',
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
                  const batchString = product.batch.toString();
                  // Check if the subject title or location matches the search input
                  if (idString.includes(searchLower) || product.name.toLowerCase().includes(searchLower) ||
                    costString.includes(searchLower) || sellString.includes(searchLower) || 
                    batchString.includes(searchLower)
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
            let index = 0
            if(this.products.length) {
                const last_index = this.products[this.products.length - 1].id.toString();
                index = last_index.charAt(last_index.length - 1)
                index = Number(index) +1
            }
            else {
                index = this.products.length + 1;
            }
            newProduct = {
                id: index,
                name: 'Product-'+index,
                cost: 10,
                sell: 15,
                batch: 50,
                more: false
            };
            this.products.push(newProduct);
        },
        showMore(product) {
            product.more = !product.more;
        },
        totalCost(element) {
            let cost = element.cost * element.batch
            let sell = element.sell * element.batch
            return {cost, sell}
        },
        applySort(tag) {
            this.sort.tag = tag;
            this.sort.direction = !this.sort.direction;
        },
        addMargin() {
            let index = 0
            if(this.margins.length) {
              const last_index = this.margins[this.margins.length - 1].id.toString();
              index = last_index.charAt(last_index.length - 1)
              index = Number(index) +1
            }
            else {
              index = this.margins.length + 1;
            }
            newMargin = {
              id: index,
              name: 'Margin-'+index,
              cost: 10,
            };
            this.margins.push(newMargin);
        },
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
    },
})