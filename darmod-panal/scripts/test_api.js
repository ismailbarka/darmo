const API_BASE_URL = "https://darmod-api.vercel.app";

async function testEndpoints() {
  console.log("🚀 Starting API Tests on " + API_BASE_URL);
  
  try {
    // 1. Test Categories
    console.log("\n--- Testing Categories ---");
    
    // Fetch Categories
    const categoriesRes = await fetch(`${API_BASE_URL}/categories`);
    const categories = await categoriesRes.json();
    console.log(`✅ Fetch Categories: Found ${categories.length} categories`);
    
    // Create Test Category
    const newCat = { nameFr: "Test " + Date.now(), nameAr: "تجربة " + Date.now() };
    const createCatRes = await fetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCat)
    });
    const createdCat = await createCatRes.json();
    console.log(`✅ Create Category: ${createdCat.nameFr} (ID: ${createdCat.id})`);
    
    // 2. Test Providers
    console.log("\n--- Testing Providers ---");
    
    // Fetch Providers
    const providersRes = await fetch(`${API_BASE_URL}/providers`);
    const providers = await providersRes.json();
    console.log(`✅ Fetch Providers: Found ${providers.length} providers`);
    
    // Create Test Provider
    const fd = new FormData();
    fd.append("firstnameFr", "Test");
    fd.append("lastnameFr", "User");
    fd.append("firstnameAr", "تجربة");
    fd.append("lastnameAr", "مستخدم");
    fd.append("phone", "+2126" + Math.floor(10000000 + Math.random() * 90000000));
    fd.append("descriptionFr", "Test desc");
    fd.append("descriptionAr", "وصف تجريبي");
    fd.append("latitude", "33.5731");
    fd.append("longitude", "-7.5898");
    fd.append("categoryId", createdCat.id.toString());
    fd.append("rating", "5");
    fd.append("isActive", "true");

    const createProvRes = await fetch(`${API_BASE_URL}/providers`, {
      method: "POST",
      body: fd
    });
    
    if (!createProvRes.ok) {
      const errData = await createProvRes.json();
      console.error("❌ Provider Creation Failed:", JSON.stringify(errData, null, 2));
      throw new Error("Validation error");
    }
    
    const createdProv = await createProvRes.json();
    console.log(`✅ Create Provider: ${createdProv.firstnameFr} (ID: ${createdProv.id})`);
    
    // Update Provider (Test isActive update)
    const updateFd = new FormData();
    updateFd.append("isActive", "false");
    const updateProvRes = await fetch(`${API_BASE_URL}/providers/${createdProv.id}`, {
      method: "PATCH",
      body: updateFd
    });
    
    if (!updateProvRes.ok) {
      const errData = await updateProvRes.json();
      console.error("❌ Provider Update Failed:", JSON.stringify(errData, null, 2));
      throw new Error("Update failed");
    }
    const updatedProv = await updateProvRes.json();
    console.log(`✅ Update Provider (Set isActive=false): ${updatedProv.isActive === false ? "SUCCESS" : "FAILED"}`);
    
    // 3. Cleanup
    console.log("\n--- Cleanup ---");
    
    // Delete Provider
    await fetch(`${API_BASE_URL}/providers/${createdProv.id}`, { method: "DELETE" });
    console.log(`✅ Delete Provider: ID ${createdProv.id}`);
    
    // Delete Category
    await fetch(`${API_BASE_URL}/categories/${createdCat.id}`, { method: "DELETE" });
    console.log(`✅ Delete Category: ID ${createdCat.id}`);
    
    console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉");
    
  } catch (error) {
    console.error("\n❌ TEST FAILED:");
    console.error(error);
    process.exit(1);
  }
}

testEndpoints();
