# Step 4 Sub-Room Details API Specification

## 📋 Overview

This document specifies the requirements for Step 4 of the `/partner/create-service` page, which handles **sub-room details** (individual room configurations with specific opening/closing times and prices).

**Frontend Page:** `/partner/create-service` (Step 4)  
**Purpose:** Define detailed information for each individual room/service instance  
**Status:** ✅ **UI Complete with Editable Fields**

---

## 🎯 What is Step 4?

Step 4 allows partners to define **granular details** for each room or service instance. 

**Example Scenario:**
- **Step 3:** Partner defines "ห้องเดี่ยว (Single Room)" with quantity = 5
- **Step 4:** Partner defines specific details for each of the 5 rooms:
  - Room 001: Open 08:00, Close 20:00, Price 500 บาท
  - Room 002: Open 08:00, Close 20:00, Price 500 บาท
  - Room 003: Open 09:00, Close 21:00, Price 600 บาท (different schedule/price!)
  - Room 004: Open 08:00, Close 20:00, Price 500 บาท
  - Room 005: Open 08:00, Close 20:00, Price 500 บาท

---

## 🆕 New Features Implemented

### **1. Editable Fields in Step 4** ✅

The following fields are now **editable** in Step 4:
- ✅ **Opening Time** (`open_time`) - Time input (HH:mm format)
- ✅ **Closing Time** (`close_time`) - Time input (HH:mm format)
- ✅ **Price** (`price`) - Number input

**Non-Editable Fields (Auto-Generated):**
- Room/Service Code (e.g., "ห้-001", "SP-001")
- Room/Service Name (inherited from Step 3)

---

## 📊 Data Structure

### **Step 4 Data Format:**

```typescript
interface Step4SubRoomDetails {
  room_services: {
    room_type: string;           // e.g., "ห้องเดี่ยว"
    sub_rooms: {
      code: string;               // Auto-generated: "ห้-001"
      name: string;               // Same as room_type
      open_time: string;          // Editable: "08:00"
      close_time: string;         // Editable: "20:00"
      price: number;              // Editable: 500
    }[];
  }[];
  
  special_services: {
    service_type: string;         // e.g., "สปาสัตว์เลี้ยง"
    sub_services: {
      code: string;               // Auto-generated: "SP-001"
      name: string;               // Same as service_type
      open_time: string;          // Editable: "09:00"
      close_time: string;         // Editable: "18:00"
      price: number;              // Editable: 300
    }[];
  }[];
  
  pet_care_services: {
    service_type: string;         // e.g., "รับฝากสุนัขขนาดเล็ก"
    sub_services: {
      code: string;               // Auto-generated: "PC-001"
      name: string;               // Same as service_type
      open_time: string;          // Editable: "00:00"
      close_time: string;         // Editable: "23:59"
      price: number;              // Editable: 400
    }[];
  }[];
}
```

---

## 📤 Complete Payload Example

### **POST /api/partner/create-service (Updated)**

```json
{
  "personal_info": { "..." },
  "hotel_location": { "..." },
  "documents": { "..." },
  "service_configuration": { "..." },
  "accommodation_photos": { "..." },
  
  "room_services": [
    {
      "room_type": "ห้องเดี่ยว",
      "quantity": 5,
      "open_time": "08:00",
      "close_time": "20:00",
      "price": 500
    }
  ],
  
  "special_services": [ "..." ],
  "pet_care_services": [ "..." ],
  
  "sub_room_details": {
    "room_services": [
      {
        "room_type": "ห้องเดี่ยว",
        "sub_rooms": [
          {
            "code": "ห้-001",
            "name": "ห้องเดี่ยว",
            "open_time": "08:00",
            "close_time": "20:00",
            "price": 500
          },
          {
            "code": "ห้-002",
            "name": "ห้องเดี่ยว",
            "open_time": "08:00",
            "close_time": "20:00",
            "price": 500
          },
          {
            "code": "ห้-003",
            "name": "ห้องเดี่ยว",
            "open_time": "09:00",
            "close_time": "21:00",
            "price": 600
          }
        ]
      }
    ],
    "special_services": [
      {
        "service_type": "สปาสัตว์เลี้ยง",
        "sub_services": [
          {
            "code": "SP-001",
            "name": "สปาสัตว์เลี้ยง",
            "open_time": "09:00",
            "close_time": "18:00",
            "price": 300
          }
        ]
      }
    ],
    "pet_care_services": [
      {
        "service_type": "รับฝากสุนัขขนาดเล็ก",
        "sub_services": [
          {
            "code": "PC-001",
            "name": "รับฝากสุนัขขนาดเล็ก",
            "open_time": "00:00",
            "close_time": "23:59",
            "price": 400
          }
        ]
      }
    ]
  }
}
```

---

## 📥 GET Endpoint - Retrieve Existing Data

### **GET /api/partner/service-data (Updated Response)**

The backend should return sub-room details so they can be displayed when editing:

```json
{
  "success": true,
  "message": "Service data retrieved successfully",
  "data": {
    "personal_info": { "..." },
    "hotel_location": { "..." },
    "documents": { "..." },
    "service_configuration": { "..." },
    "accommodation_photos": { "..." },
    "room_services": [ "..." ],
    "special_services": [ "..." ],
    "pet_care_services": [ "..." ],
    
    "sub_room_details": {
      "room_services": [
        {
          "room_type": "ห้องเดี่ยว",
          "sub_rooms": [
            {
              "code": "ห้-001",
              "name": "ห้องเดี่ยว",
              "open_time": "08:00",
              "close_time": "20:00",
              "price": 500
            },
            {
              "code": "ห้-002",
              "name": "ห้องเดี่ยว",
              "open_time": "08:00",
              "close_time": "20:00",
              "price": 500
            }
          ]
        }
      ],
      "special_services": [
        {
          "service_type": "สปาสัตว์เลี้ยง",
          "sub_services": [
            {
              "code": "SP-001",
              "name": "สปาสัตว์เลี้ยง",
              "open_time": "09:00",
              "close_time": "18:00",
              "price": 300
            }
          ]
        }
      ],
      "pet_care_services": [
        {
          "service_type": "รับฝากสุนัขขนาดเล็ก",
          "sub_services": [
            {
              "code": "PC-001",
              "name": "รับฝากสุนัขขนาดเล็ก",
              "open_time": "00:00",
              "close_time": "23:59",
              "price": 400
            }
          ]
        }
      ]
    }
  }
}
```

---

## 🗄️ Database Schema Recommendations

### **New Tables:**

#### **1. `sub_room_details`**
```sql
CREATE TABLE sub_room_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID NOT NULL REFERENCES partner_services(id) ON DELETE CASCADE,
  parent_service_id UUID NOT NULL, -- FK to room_services/special_services/pet_care_services
  service_type VARCHAR(50) NOT NULL, -- 'room' | 'special' | 'petcare'
  code VARCHAR(50) NOT NULL, -- e.g., 'ห้-001', 'SP-001', 'PC-001'
  name VARCHAR(200) NOT NULL,
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sub_room_service_id ON sub_room_details(service_id);
CREATE INDEX idx_sub_room_parent_id ON sub_room_details(parent_service_id);
```

---

## 🔄 Data Flow

### **Save Flow:**

1. **User fills Steps 1-3** → Defines basic services
2. **Frontend generates Step 4 forms** → Based on Step 3 quantities
3. **User edits Step 4 fields** → Customizes each room/service
4. **User clicks "บันทึกข้อมูล" (Save)**
5. **Frontend sends complete payload** → Including `sub_room_details`
6. **Backend saves:**
   - Personal info, hotel location, documents
   - Service configuration
   - Accommodation photos
   - **Room services** (Step 3 data)
   - **Sub-room details** (Step 4 data) ✅ NEW

### **Retrieve Flow:**

1. **User opens `/partner/create-service`**
2. **Frontend calls:** `GET /api/partner/service-data`
3. **Backend returns:** All data including `sub_room_details`
4. **Frontend displays:**
   - Step 1-3: Form fields populated
   - **Step 4: Sub-room details populated** ✅ NEW
5. **User can edit and re-save**

---

## 📋 Field Specifications

### **Sub-Room Details Fields:**

| Field | Type | Editable | Required | Description |
|-------|------|----------|----------|-------------|
| `code` | string | ❌ No | Yes | Auto-generated room/service code |
| `name` | string | ❌ No | Yes | Inherited from parent service |
| `open_time` | string (HH:mm) | ✅ Yes | Yes | Opening time for this specific room/service |
| `close_time` | string (HH:mm) | ✅ Yes | Yes | Closing time for this specific room/service |
| `price` | number | ✅ Yes | Yes | Price for this specific room/service |

---

## ✅ Validation Rules

### **Time Validation:**
- Format: `HH:mm` (24-hour)
- `close_time` must be after `open_time`
- Valid range: `00:00` to `23:59`

### **Price Validation:**
- Must be >= 0
- Can be decimal (e.g., 500.50)
- No maximum limit

### **Code Format:**
- **Room services:** `ห้-XXX` (e.g., "ห้-001")
- **Special services:** `SP-XXX` (e.g., "SP-001")
- **Pet care services:** `PC-XXX` (e.g., "PC-001")

---

## 🎯 Use Cases

### **Use Case 1: Standard Pricing**
All rooms have the same schedule and price:
- Room 001-005: All 08:00-20:00, 500 บาท

### **Use Case 2: Dynamic Pricing**
Different rooms have different prices:
- Room 001-003: 08:00-20:00, 500 บาท (Standard)
- Room 004-005: 08:00-20:00, 700 บาท (Premium)

### **Use Case 3: Flexible Hours**
Different rooms have different operating hours:
- Room 001-003: 08:00-20:00, 500 บาท
- Room 004: 00:00-23:59, 800 บาท (24-hour)
- Room 005: 10:00-18:00, 400 บาท (Short hours)

---

## 🧪 Testing Checklist

### **Backend:**
- [ ] Save sub-room details with POST
- [ ] Retrieve sub-room details with GET
- [ ] Update existing sub-room details
- [ ] Delete sub-room details when parent service is deleted
- [ ] Validate time format (HH:mm)
- [ ] Validate close_time > open_time
- [ ] Validate price >= 0

### **Frontend:**
- [x] ✅ Generate Step 4 forms from Step 3 data
- [x] ✅ Make time fields editable
- [x] ✅ Make price fields editable
- [x] ✅ Preserve edited values in state
- [ ] Send sub-room details in payload
- [ ] Display sub-room details when editing
- [ ] Validate form before submission

---

## 🔧 Frontend Implementation Status

### **Completed:**
- ✅ Editable opening time fields
- ✅ Editable closing time fields
- ✅ Editable price fields
- ✅ State management for edited values
- ✅ UI styling for editable/non-editable fields

### **Pending:**
- ⏳ Include sub-room details in submission payload
- ⏳ Populate sub-room details from GET response
- ⏳ Validation before submission

---

## 📝 Important Notes

### **For Backend Team:**

1. **Data Relationship:**
   - `sub_room_details` are child records of `room_services`, `special_services`, `pet_care_services`
   - When a parent service is deleted, cascade delete all sub-room details

2. **Code Generation:**
   - Frontend generates codes (ห้-001, SP-001, etc.)
   - Backend can regenerate or use frontend codes
   - Ensure uniqueness within service type

3. **Default Values:**
   - If Step 4 data is missing, use Step 3 values as defaults
   - Example: If no sub-room details, all rooms inherit from parent service

4. **Backward Compatibility:**
   - Old services without sub-room details should still work
   - Display Step 3 values if Step 4 data doesn't exist

---

## 🚀 Deployment Requirements

### **Database:**
- [ ] Create `sub_room_details` table
- [ ] Add foreign key constraints
- [ ] Create indexes for performance

### **API:**
- [ ] Update POST endpoint to accept `sub_room_details`
- [ ] Update GET endpoint to return `sub_room_details`
- [ ] Add validation for new fields

### **Data Migration (If Needed):**
- [ ] Generate sub-room details for existing services
- [ ] Use parent service values as defaults

---

## 📞 Contact

**Priority:** 🟡 **MEDIUM** - Enhancement feature

**Questions?** Contact the Frontend team for:
- Data structure clarification
- UI/UX behavior
- Field mapping details

---

**Document Created:** October 19, 2025  
**Status:** ⚠️ **Pending Backend Implementation**  
**Frontend Status:** ✅ **UI Complete, Integration Pending**

---

## 🎉 Summary

**What's New:**
- Step 4 now has **editable** opening time, closing time, and price fields
- Each room/service can have **individualized** details
- Frontend state management is complete
- Backend needs to implement save/retrieve for `sub_room_details`

**Next Steps:**
1. Backend implements `sub_room_details` storage
2. Frontend integrates with backend API
3. Testing and validation
4. Production deployment

