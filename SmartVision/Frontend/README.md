# Partners Management Form Frontend

## Overview
This frontend application automatically fetches data from the Zoho CRM API and pre-fills form fields with existing data. Fields that have data are locked and cannot be edited, while empty fields remain editable.

## Features

### 🔄 Automatic Data Loading
- Fetches data from `http://localhost:3000/get-data` on page load
- Extracts the data object from the API response
- Maps API fields to form fields automatically

### 🔒 Smart Field Locking
- Fields with existing data are automatically locked
- Visual indicators show which fields are pre-filled
- Lock icon (🔒) and "Pre-filled data" text appear for locked fields
- Locked fields have a green border and gray background

### 📋 Field Mapping
The system maps the following API fields to form fields:

#### Partners Section
- `Partners_resellers` → `partners`

#### Partner Type & Industry
- `Marketer` → `marketer`
- `Hajj_Campign` → `hajjCampaign`
- `Hajj_mission` → `hajjMission`
- `Contrator` → `contractor`
- `Other` → `other`

#### Contract Information
- `Serial_Number` → `serialNumber`
- `Draft` → `draft`
- `Singed_Copy` → `singedCopy`
- `confirmation_letter_copy` → `confirmationLetter`

#### Location
- `Country` → `country`
- `City` → `city`

#### Manager Information
- `Full_Name` → `fullName`
- `Manager_Email` → `managerEmail`
- `Manager_Phone` → `managerPhone`
- `Manager_Email_2` → `managerEmail2`
- `Manger_Phone_2` → `mangerPhone2`
- `Position` → `position`

#### Finance Manager
- `Is_the_same_finance_manger` → `sameFinanceManager`
- `FM_Full_Name` → `fmFullName`
- `FM_Email` → `fmEmail`
- `FM_Phone` → `fmPhone`
- `FM_Email_2` → `fmEmail2`
- `FM_Phone_2` → `fmPhone2`
- `FM_Position` → `fmPosition`

#### IT Manager
- `Checkbox_2` → `checkbox2`
- `IT_Manager_Name` → `itManagerName`
- `IT_Manager_Email` → `itManagerEmail`
- `IT_Manager_Phone` → `itManagerPhone`
- `IT_Manager_Email_2` → `itManagerEmail2`
- `IT_Manager_Phone_2` → `itManagerPhone2`
- `IT_Manager_Position` → `itManagerPosition`

#### Financial Information
- `Exported_Invoices_copy` → `exportedInvoices`
- `Financial_settlement_copy` → `financialSettlement`
- `Reconciliation_Copy` → `reconciliationCopy`
- `Account_Performance_Per_Sales` → `accountPerformance`

### 🎨 Visual Features
- **Success Notification**: Shows a summary of populated fields
- **Error Handling**: Displays error messages for network issues
- **Responsive Design**: Works on all device sizes
- **Modern UI**: Clean, professional appearance

### 📊 Data Processing
- Handles different data types (text, email, phone, checkbox, file)
- Converts arrays to comma-separated strings
- Handles null/undefined values gracefully
- Preserves original data formatting

## Usage

1. **Start the Backend Server**
   ```bash
   cd Backend
   npm start
   ```

2. **Open the Frontend**
   - Open `Frontend/index.html` in a web browser
   - Or serve it using a local server

3. **Data Loading**
   - The form automatically loads data when the page loads
   - Fields with data are locked and show a green border
   - Empty fields remain editable

4. **Form Submission**
   - Only editable fields are included in form submission
   - Locked fields preserve their original values

## Technical Details

### API Integration
- Makes GET request to `http://localhost:3000/get-data`
- Expects response format: `{ success: true, data: {...} }`
- Handles CORS and network errors gracefully

### Browser Compatibility
- Works in all modern browsers
- Includes fallback styles for older browsers
- Uses CSS Grid and Flexbox for layout

### Performance
- Efficient field mapping and population
- Minimal DOM manipulation
- Optimized CSS animations

## Troubleshooting

### Common Issues

1. **No data loading**
   - Check if backend server is running on port 3000
   - Verify CORS settings in backend
   - Check browser console for errors

2. **Fields not populating**
   - Verify field IDs match between HTML and JavaScript
   - Check API response format
   - Ensure data values are not null/undefined

3. **Styling issues**
   - Check if CSS file is loaded properly
   - Verify browser supports CSS Grid/Flexbox
   - Clear browser cache if needed

### Debug Information
- Check browser console for detailed logs
- Network tab shows API requests/responses
- Console logs show which fields were populated 