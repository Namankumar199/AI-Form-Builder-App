export const FormTemplates = [
  {
    id: 1,
    name: "Contact Form",
    description: "Simple contact form with name, email, and message",
    category: "General",
    icon: "📧",
    template: {
      title: "Contact Us",
      subheading: "Get in touch with us",
      fields: [
        {
          name: "name",
          label: "Full Name",
          placeholder: "Enter your full name",
          fieldType: "text",
          required: true
        },
        {
          name: "email",
          label: "Email Address",
          placeholder: "Enter your email",
          fieldType: "email",
          required: true
        },
        {
          name: "phone",
          label: "Phone Number",
          placeholder: "Enter your phone number",
          fieldType: "tel",
          required: false
        },
        {
          name: "message",
          label: "Message",
          placeholder: "Enter your message",
          fieldType: "textarea",
          required: true
        },
        {
          name: "attachment",
          label: "Attachment (Optional)",
          fieldType: "file",
          required: false,
          maxFiles: 3,
          acceptedTypes: ['image/*', '.pdf', '.doc', '.docx']
        }
      ]
    }
  },
  {
    id: 2,
    name: "Event Registration",
    description: "Registration form for events and workshops",
    category: "Events",
    icon: "🎟️",
    template: {
      title: "Event Registration",
      subheading: "Register for our upcoming event",
      fields: [
        {
          name: "name",
          label: "Full Name",
          placeholder: "Enter your full name",
          fieldType: "text",
          required: true
        },
        {
          name: "email",
          label: "Email Address",
          placeholder: "Enter your email",
          fieldType: "email",
          required: true
        },
        {
          name: "eventType",
          label: "Event Type",
          fieldType: "select",
          required: true,
          options: [
            { value: "workshop", label: "Workshop" },
            { value: "seminar", label: "Seminar" },
            { value: "conference", label: "Conference" }
          ]
        },
        {
          name: "attendeeType",
          label: "Attendee Type",
          fieldType: "select",
          required: true,
          options: [
            { value: "student", label: "Student" },
            { value: "professional", label: "Professional" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "studentId",
          label: "Student ID",
          placeholder: "Enter your student ID",
          fieldType: "text",
          required: true,
          conditions: [{
            field: "attendeeType",
            operator: "equals",
            value: "student"
          }]
        },
        {
          name: "company",
          label: "Company Name",
          placeholder: "Enter your company name",
          fieldType: "text",
          required: true,
          conditions: [{
            field: "attendeeType",
            operator: "equals",
            value: "professional"
          }]
        },
        {
          name: "dietary",
          label: "Dietary Requirements",
          placeholder: "Any dietary restrictions?",
          fieldType: "textarea",
          required: false
        }
      ]
    }
  },
  {
    id: 3,
    name: "Job Application",
    description: "Professional job application form",
    category: "HR",
    icon: "💼",
    template: {
      title: "Job Application",
      subheading: "Apply for your dream job",
      fields: [
        {
          name: "name",
          label: "Full Name",
          placeholder: "Enter your full name",
          fieldType: "text",
          required: true
        },
        {
          name: "email",
          label: "Email Address",
          placeholder: "Enter your email",
          fieldType: "email",
          required: true
        },
        {
          name: "position",
          label: "Position Applied For",
          placeholder: "Enter position title",
          fieldType: "text",
          required: true
        },
        {
          name: "experience",
          label: "Years of Experience",
          fieldType: "select",
          required: true,
          options: [
            { value: "0-1", label: "0-1 years" },
            { value: "2-5", label: "2-5 years" },
            { value: "5-10", label: "5-10 years" },
            { value: "10+", label: "10+ years" }
          ]
        },
        {
          name: "coverLetter",
          label: "Cover Letter",
          placeholder: "Tell us why you're perfect for this role",
          fieldType: "textarea",
          required: true
        },
        {
          name: "resume",
          label: "Upload Resume",
          fieldType: "file",
          required: true,
          maxFiles: 1,
          acceptedTypes: ['.pdf', '.doc', '.docx']
        },
        {
          name: "portfolio",
          label: "Portfolio/Work Samples (Optional)",
          fieldType: "file",
          required: false,
          maxFiles: 5,
          acceptedTypes: ['image/*', '.pdf', '.zip']
        }
      ]
    }
  },
  {
    id: 4,
    name: "Customer Feedback",
    description: "Collect customer feedback and ratings",
    category: "Feedback",
    icon: "⭐",
    template: {
      title: "Customer Feedback",
      subheading: "Help us improve our service",
      fields: [
        {
          name: "name",
          label: "Name (Optional)",
          placeholder: "Enter your name",
          fieldType: "text",
          required: false
        },
        {
          name: "rating",
          label: "Overall Rating",
          fieldType: "select",
          required: true,
          options: [
            { value: "5", label: "⭐⭐⭐⭐⭐ Excellent" },
            { value: "4", label: "⭐⭐⭐⭐ Good" },
            { value: "3", label: "⭐⭐⭐ Average" },
            { value: "2", label: "⭐⭐ Poor" },
            { value: "1", label: "⭐ Very Poor" }
          ]
        },
        {
          name: "feedback",
          label: "Your Feedback",
          placeholder: "Share your experience with us",
          fieldType: "textarea",
          required: true
        },
        {
          name: "recommend",
          label: "Would you recommend us?",
          fieldType: "radio",
          required: true,
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
            { value: "maybe", label: "Maybe" }
          ]
        }
      ]
    }
  },
  {
    id: 5,
    name: "Product Survey",
    description: "Comprehensive product feedback survey with conditional logic",
    category: "Survey",
    icon: "📊",
    template: {
      title: "Product Experience Survey",
      subheading: "Help us improve our product with your valuable feedback",
      fields: [
        {
          name: "name",
          label: "Your Name",
          placeholder: "Enter your full name",
          fieldType: "text",
          required: true
        },
        {
          name: "email",
          label: "Email Address",
          placeholder: "Enter your email",
          fieldType: "email",
          required: true
        },
        {
          name: "productUsage",
          label: "How often do you use our product?",
          fieldType: "select",
          required: true,
          options: [
            { value: "daily", label: "Daily" },
            { value: "weekly", label: "Weekly" },
            { value: "monthly", label: "Monthly" },
            { value: "rarely", label: "Rarely" },
            { value: "never", label: "Never used it" }
          ]
        },
        {
          name: "satisfaction",
          label: "How satisfied are you with our product?",
          fieldType: "radio",
          required: true,
          options: [
            { value: "very-satisfied", label: "Very Satisfied" },
            { value: "satisfied", label: "Satisfied" },
            { value: "neutral", label: "Neutral" },
            { value: "dissatisfied", label: "Dissatisfied" },
            { value: "very-dissatisfied", label: "Very Dissatisfied" }
          ],
          conditions: [{
            field: "productUsage",
            operator: "not_equals",
            value: "never"
          }]
        },
        {
          name: "improvements",
          label: "What improvements would you like to see?",
          placeholder: "Please describe any improvements or new features you'd like",
          fieldType: "textarea",
          required: false,
          conditions: [{
            field: "satisfaction",
            operator: "equals",
            value: "dissatisfied"
          }, {
            field: "satisfaction",
            operator: "equals",
            value: "very-dissatisfied"
          }],
          conditionLogic: "OR"
        },
        {
          name: "features",
          label: "Which features do you use most?",
          fieldType: "checkbox",
          required: false,
          options: [
            { value: "dashboard", label: "Dashboard" },
            { value: "reports", label: "Reports" },
            { value: "analytics", label: "Analytics" },
            { value: "integrations", label: "Integrations" },
            { value: "mobile-app", label: "Mobile App" }
          ],
          conditions: [{
            field: "productUsage",
            operator: "not_equals",
            value: "never"
          }]
        },
        {
          name: "screenshot",
          label: "Upload Screenshot (Optional)",
          fieldType: "file",
          required: false,
          maxFiles: 3,
          acceptedTypes: ['image/*'],
          conditions: [{
            field: "satisfaction",
            operator: "equals",
            value: "dissatisfied"
          }, {
            field: "satisfaction",
            operator: "equals",
            value: "very-dissatisfied"
          }],
          conditionLogic: "OR"
        },
        {
          name: "recommend",
          label: "Would you recommend our product to others?",
          fieldType: "radio",
          required: true,
          options: [
            { value: "definitely", label: "Definitely" },
            { value: "probably", label: "Probably" },
            { value: "not-sure", label: "Not Sure" },
            { value: "probably-not", label: "Probably Not" },
            { value: "definitely-not", label: "Definitely Not" }
          ],
          conditions: [{
            field: "productUsage",
            operator: "not_equals",
            value: "never"
          }]
        }
      ]
    }
  },
  {
    id: 6,
    name: "Event Registration (Paid)",
    description: "Paid event registration with payment integration",
    category: "Events",
    icon: "💳",
    template: {
      title: "Premium Workshop Registration",
      subheading: "Register for our exclusive workshop",
      paymentEnabled: true,
      paymentAmount: 99.99,
      fields: [
        {
          name: "name",
          label: "Full Name",
          placeholder: "Enter your full name",
          fieldType: "text",
          required: true
        },
        {
          name: "email",
          label: "Email Address",
          placeholder: "Enter your email",
          fieldType: "email",
          required: true
        },
        {
          name: "phone",
          label: "Phone Number",
          placeholder: "Enter your phone number",
          fieldType: "tel",
          required: true
        },
        {
          name: "experience",
          label: "Experience Level",
          fieldType: "select",
          required: true,
          options: [
            { value: "beginner", label: "Beginner" },
            { value: "intermediate", label: "Intermediate" },
            { value: "advanced", label: "Advanced" }
          ]
        },
        {
          name: "expectations",
          label: "What do you hope to learn?",
          placeholder: "Tell us about your learning goals",
          fieldType: "textarea",
          required: false
        }
      ]
    }
  }
];