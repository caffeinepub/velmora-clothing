import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type Category = {
    #shirt;
    #tshirt;
    #hoodie;
  };

  module Category {
    public func toText(category : Category) : Text {
      switch (category) {
        case (#shirt) { "shirt" };
        case (#tshirt) { "tshirt" };
        case (#hoodie) { "hoodie" };
      };
    };
  };

  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat; // in paise
    category : Category;
    sizes : [Text];
    color : Text;
    imageUrl : Text;
    inStock : Bool;
    createdAt : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  let productsMap = Map.empty<Nat, Product>();
  var nextId = 1;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Seed products using a single array of products
  let seedProducts = [
    // Shirts
    {
      id = 1;
      name = "Classic White Shirt";
      description = "Timeless formal shirt";
      price = 129900; // ₹1299
      category = #shirt;
      sizes = ["S", "M", "L", "XL"];
      color = "White";
      imageUrl = "/images/shirts/classic-white.jpg";
      inStock = true;
      createdAt = Time.now();
    },
    {
      id = 2;
      name = "Blue Denim Shirt";
      description = "Casual denim look";
      price = 199900; // ₹1999
      category = #shirt;
      sizes = ["M", "L", "XL"];
      color = "Blue";
      imageUrl = "/images/shirts/blue-denim.jpg";
      inStock = true;
      createdAt = Time.now();
    },
    {
      id = 3;
      name = "Striped Formal Shirt";
      description = "Elegant for office wear";
      price = 249900; // ₹2499
      category = #shirt;
      sizes = ["S", "M", "L"];
      color = "Striped";
      imageUrl = "/images/shirts/striped-formal.jpg";
      inStock = true;
      createdAt = Time.now();
    },

    // Tshirts
    {
      id = 4;
      name = "Graphic Tee";
      description = "Trendy design";
      price = 69900; // ₹699
      category = #tshirt;
      sizes = ["S", "M", "L", "XL", "XXL"];
      color = "Black";
      imageUrl = "/images/tshirts/graphic-tee.jpg";
      inStock = true;
      createdAt = Time.now();
    },
    {
      id = 5;
      name = "Polo T-Shirt";
      description = "Comfortable everyday wear";
      price = 119900; // ₹1199
      category = #tshirt;
      sizes = ["M", "L", "XL"];
      color = "Red";
      imageUrl = "/images/tshirts/polo-tshirt.jpg";
      inStock = true;
      createdAt = Time.now();
    },
    {
      id = 6;
      name = "Basic White Tee";
      description = "Essential wardrobe item";
      price = 149900; // ₹1499
      category = #tshirt;
      sizes = ["M", "L", "XL"];
      color = "White";
      imageUrl = "/images/tshirts/basic-white.jpg";
      inStock = true;
      createdAt = Time.now();
    },

    // Hoodies
    {
      id = 7;
      name = "Classic Grey Hoodie";
      description = "Warm and comfortable";
      price = 179900; // ₹1799
      category = #hoodie;
      sizes = ["S", "M", "L", "XL"];
      color = "Grey";
      imageUrl = "/images/hoodies/classic-grey.jpg";
      inStock = true;
      createdAt = Time.now();
    },
    {
      id = 8;
      name = "Zip-Up Hoodie";
      description = "Stylish casual wear";
      price = 249900; // ₹2499
      category = #hoodie;
      sizes = ["M", "L", "XL"];
      color = "Black";
      imageUrl = "/images/hoodies/zip-up-black.jpg";
      inStock = true;
      createdAt = Time.now();
    },
    {
      id = 9;
      name = "Printed Hoodie";
      description = "Trendy and vibrant";
      price = 299900; // ₹2999
      category = #hoodie;
      sizes = ["L", "XL", "XXL"];
      color = "Printed";
      imageUrl = "/images/hoodies/printed.jpg";
      inStock = true;
      createdAt = Time.now();
    },
  ];

  // Initialize products map with seed products
  for (product in seedProducts.values()) {
    productsMap.add(product.id, product);
  };

  nextId := 10;

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Admin check function
  public query ({ caller }) func isAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // Product management functions (admin-only)
  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

    let newProduct = {
      product with
      id = nextId;
      createdAt = Time.now();
    };
    productsMap.add(nextId, newProduct);
    nextId += 1;
  };

  public shared ({ caller }) func updateProduct(id : Nat, updatedProduct : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    switch (productsMap.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        let newProduct = {
          updatedProduct with
          id;
        };
        productsMap.add(id, newProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    productsMap.remove(id);
  };

  // Public query functions (no authorization needed)
  public query func getProduct(id : Nat) : async ?Product {
    productsMap.get(id);
  };

  public query func getProducts() : async [Product] {
    productsMap.values().toArray();
  };

  public query func getProductsByCategory(category : Category) : async [Product] {
    let productsIter = productsMap.values();
    let filteredIter = productsIter.filter(
      func(product) {
        product.category == category;
      }
    );
    filteredIter.toArray();
  };
};
