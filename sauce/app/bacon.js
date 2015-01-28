//----------------------------------------------------------------
// product class
function product(sku, name, category, info, description, tags, image, stock, price, aditional_info) {
    this.sku = sku; // product code (SKU = stock keeping unit)
    this.name = name;
    this.category = category;
    this.info = info;
    this.description = description;
    this.tags = tags;
    this.image = image;
    this.stock = stock;
    this.price = price;
    this.aditional_info = aditional_info;
}
