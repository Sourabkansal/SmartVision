document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("partnerForm");

  let inventoryItemCount = 0;
  let nonInventoryItemCount = 0;

  // Fetch latest MIR number on page load
  fetchLatestMIRNumber();

  // Function to fetch latest MIR number from backend
  async function fetchLatestMIRNumber() {
    try {
      const response = await fetch('http://localhost:3000/get-latest-mir');
      if (response.ok) {
        const result = await response.json();
        console.log('Latest MIR data:', result);
        
        if (result.success && result.nextMIR) {
          // Auto-populate the MIR_No field
          const mirNoField = document.getElementById('mirNo');
          if (mirNoField) {
            mirNoField.value = result.nextMIR;
            console.log('Auto-populated MIR_No:', result.nextMIR);
          }
        }
      } else {
        console.error('Failed to fetch latest MIR number');
      }
    } catch (error) {
      console.error('Error fetching latest MIR number:', error);
    }
  }

  // Initialize dynamic item functions
  window.addInventoryItem = function() {
    inventoryItemCount++;
    const container = document.getElementById('inventoryItems');
    const itemRow = document.createElement('div');
    itemRow.className = 'item-row';
    itemRow.innerHTML = `
      <div class="item-cell">
        <input type="text" placeholder="Product Name" name="inventoryProductName_${inventoryItemCount}">
      </div>
      <div class="item-cell">
        <input type="text" placeholder="Part Number" name="inventoryPartNumber_${inventoryItemCount}" required>
      </div>
      <div class="item-cell">
        <input type="number" placeholder="Quantity" name="inventoryQuantity_${inventoryItemCount}" min="1">
      </div>
      <div class="item-cell">
        <button type="button" class="remove-item-btn" onclick="removeInventoryItem(this)">Remove</button>
      </div>
    `;
    container.appendChild(itemRow);
  };

  window.addNonInventoryItem = function() {
    nonInventoryItemCount++;
    const container = document.getElementById('nonInventoryItems');
    const itemRow = document.createElement('div');
    itemRow.className = 'item-row non-inventory';
    itemRow.innerHTML = `
      <div class="item-cell">
        <input type="text" placeholder="Product Name" name="nonInventoryProductName_${nonInventoryItemCount}">
      </div>
      <div class="item-cell">
        <input type="text" placeholder="Product Code" name="nonInventoryProductCode_${nonInventoryItemCount}">
      </div>
      <div class="item-cell">
        <input type="text" placeholder="Specification" name="nonInventorySpecification_${nonInventoryItemCount}">
      </div>
      <div class="item-cell">
        <input type="text" placeholder="Description" name="nonInventoryDescription_${nonInventoryItemCount}">
      </div>
      <div class="item-cell">
        <input type="number" placeholder="Quantity" name="nonInventoryQuantity_${nonInventoryItemCount}" min="1">
      </div>
      <div class="item-cell">
        <button type="button" class="remove-item-btn" onclick="removeNonInventoryItem(this)">Remove</button>
      </div>
    `;
    container.appendChild(itemRow);
  };

  window.removeInventoryItem = function(button) {
    button.closest('.item-row').remove();
  };

  window.removeNonInventoryItem = function(button) {
    button.closest('.item-row').remove();
  };

  // Form submission handler
  form.addEventListener("submit", async function (e) {
    e.preventDefault();


    const formData = collectFormData();
    console.log("Form data:", JSON.stringify(formData, null, 2));

    try {
      const response = await fetch(`http://localhost:3000/set-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Success response:", result);
        alert("Form submitted successfully!");
      } else {
        console.error("Error response:", response.status, response.statusText);
        alert("Error submitting form. Check console for details.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Check console for details.");
    }
  });

  // Reset form handler
  form.addEventListener("reset", function () {
    console.clear();

    // Clear dynamic items
    document.getElementById('inventoryItems').innerHTML = '';
    document.getElementById('nonInventoryItems').innerHTML = '';
    inventoryItemCount = 0;
    nonInventoryItemCount = 0;
  });

  // Function to collect form data with subform structure
  function collectFormData() {
    const recordData = {};

    // Map form fields to Zoho CRM field names (exact match)
    if (getValue("customerPO")) recordData["PO_No"] = getValue("customerPO");
    if (getValue("contactEmail")) recordData["Contact_Email_Address"] = getValue("contactEmail");
    if (getValue("contactPhone")) recordData["Contact_Phone_Number"] = getValue("contactPhone");
    if (getValue("contactMobile")) recordData["Contact_Mobile_Number"] = getValue("contactMobile");
    if (getValue("poDate")) recordData["PO_Date"] = getValue("poDate");
    if (getValue("opportunityID")) recordData["Opportunity_ID1"] = getValue("opportunityID");
    if (getValue("mirNo")) recordData["MIR_No"] = getValue("mirNo");
    if (getValue("mirDate")) recordData["MIR_Date"] = getValue("mirDate");

    // Handle Account_Name as object structure
    const accountName = getValue("accountName");
    if (accountName) {
      recordData["Account_Name"] = {
        "Account_Name": accountName,
        "zc_display_value": accountName
      };
    }

    // Handle Contact_Person as object structure
    const contactPerson = getValue("contactPerson");
    if (contactPerson) {
      recordData["Contact_Person"] = {
        "Contact_Person": contactPerson,
        "zc_display_value": contactPerson
      };
    }

    // Inventory Items Subform
    const inventoryItems = [];
    const inventoryRows = document.querySelectorAll('#inventoryItems .item-row');
    inventoryRows.forEach((row) => {
      const productName = row.querySelector('input[name^="inventoryProductName"]')?.value;
      const partNumber = row.querySelector('input[name^="inventoryPartNumber"]')?.value;
      const quantity = row.querySelector('input[name^="inventoryQuantity"]')?.value;
      
      if (productName || partNumber || quantity) {
        inventoryItems.push({
          Product_Name: productName || '',
          Part_Number: partNumber || '',
          Quantity: quantity || '1'
        });
      }
    });
    if (inventoryItems.length > 0) {
      recordData["Inventory_Items"] = inventoryItems;
    }

    // Non-Inventory Items Subform
    const nonInventoryItems = [];
    const nonInventoryRows = document.querySelectorAll('#nonInventoryItems .item-row');
    nonInventoryRows.forEach((row) => {
      const productName = row.querySelector('input[name^="nonInventoryProductName"]')?.value;
      const productCode = row.querySelector('input[name^="nonInventoryProductCode"]')?.value;
      const specification = row.querySelector('input[name^="nonInventorySpecification"]')?.value;
      const description = row.querySelector('input[name^="nonInventoryDescription"]')?.value;
      const quantity = row.querySelector('input[name^="nonInventoryQuantity"]')?.value;
      
      if (productName || productCode || specification || description || quantity) {
        nonInventoryItems.push({
          Product_Name: productName || '',
          Product_Code: productCode || '',
          Specification: specification || '',
          Description: description || '',
          Quantity: quantity || '1'
        });
      }
    });
    if (nonInventoryItems.length > 0) {
      recordData["Non_Inventory_Items"] = nonInventoryItems;
    }

    // Return in the required format for Zoho CRM
    return {

      "data": [recordData]
    };
  }

  // Helper function to get input value
  function getValue(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : "";
  }

  // Auto-format phone numbers
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach((input) => {
    input.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 0) {
        if (value.length <= 3) {
          value = `+${value}`;
        } else if (value.length <= 6) {
          value = `+${value.slice(0, 3)} ${value.slice(3)}`;
        } else if (value.length <= 10) {

          value = `+${value.slice(0, 3)} (${value.slice(3, 6)}) ${value.slice(6)}`;
        } else {

          value = `+${value.slice(0, 3)} (${value.slice(3, 6)}) ${value.slice(6, 9)}-${value.slice(9, 13)}`;
        }
        e.target.value = value;
      }
    });
  });

});