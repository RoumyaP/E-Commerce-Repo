const express = require("express");
const{ getAllProducts,
        createProduct, 
        updateProduct, 
        deleteProduct, 
        getSingleProduct, 
        reviewProduct,
        getAllReviews,
        deleteReview,
        getAdminProducts
    } = require("../controllers/productController");
const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth");

const router = express.Router();


router.route("/products").get(getAllProducts);

router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);


router.route("/admin/product/new").post(isAuthenticatedUser, authorizeRoles("admin"),createProduct);

router.route("/admin/product/:id")
.put(isAuthenticatedUser, authorizeRoles("admin"),updateProduct)
.delete(isAuthenticatedUser, authorizeRoles("admin"),deleteProduct);

router.route("/product/:id").get(getSingleProduct);

router.route("/review").put(isAuthenticatedUser,reviewProduct);

router.route("/reviews").get(getAllReviews).delete(isAuthenticatedUser,deleteReview);


module.exports = router 

