import { createContext, useContext, useState } from "react";

const StaffContext = createContext();

const initialEmployees = [
  {
    id: "EMP-1001",
    firstName: "John",
    lastName: "Smith",
    email: "john.s@macburguer.com",
    phone: "+91 9876543210",
    role: "General Manager",
    department: "Management",
    store: "All Stores",
    status: "Active",
    joinDate: "2023-01-15",
    salary: 80000,
  },
  {
    id: "EMP-1002",
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.d@macburguer.com",
    phone: "+91 9876543211",
    role: "Cashier",
    department: "Sales",
    store: "Surat",
    status: "Active",
    joinDate: "2023-06-01",
    salary: 25000,
  },
  {
    id: "EMP-1003",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.j@macburguer.com",
    phone: "+91 9876543212",
    role: "Kitchen Staff",
    department: "Kitchen",
    store: "Surat",
    status: "On Leave",
    joinDate: "2023-08-10",
    salary: 20000,
  },
];

  // Mock Complex Attendance Logs based on the image
  const initialLogs = [
    {
      id: "LOG-1",
      employeeId: "EMP-1001",
      employeeName: "John Smith",
      inOut: "10:43 AM -> 12:19 PM",
      activity: "3 punch cycles",
      totalWork: "1h 21m",
      lunchBreak: "0h 0m",
      shortBreak: "1h 36m",
      status: "Present",
      date: new Date().toLocaleDateString(),
    },
    {
      id: "LOG-2",
      employeeId: "EMP-1002",
      employeeName: "Jane Doe",
      inOut: "09:00 AM -> 05:00 PM",
      activity: "2 punch cycles",
      totalWork: "7h 30m",
      lunchBreak: "0h 30m",
      shortBreak: "0h 0m",
      status: "Present",
      date: new Date().toLocaleDateString(),
    },
    {
      id: "LOG-3",
      employeeId: "EMP-1003",
      employeeName: "Mike Johnson",
      inOut: "-- : --",
      activity: "0 punch cycles",
      totalWork: "0h 0m",
      lunchBreak: "0h 0m",
      shortBreak: "0h 0m",
      status: "Absent",
      date: new Date().toLocaleDateString(),
    },
  ];

  const initialShifts = [
    { employeeId: "EMP-1001", shift: "Morning (08:00 AM - 04:00 PM)" },
    { employeeId: "EMP-1002", shift: "Morning (08:00 AM - 04:00 PM)" },
    { employeeId: "EMP-1003", shift: "Evening (04:00 PM - 12:00 AM)" },
  ];

export function StaffProvider({ children }) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [attendanceLogs, setAttendanceLogs] = useState(initialLogs);
  const [shifts, setShifts] = useState(initialShifts);
  const [currentUser, setCurrentUser] = useState(null);

  // Employee Operations
  const addEmployee = (employeeData) => {
    const newId = `EMP-${1000 + employees.length + 1}`;
    const newEmployee = { ...employeeData, id: newId };
    setEmployees([...employees, newEmployee]);
  };

  const updateEmployee = (id, updatedData) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...updatedData } : emp))
    );
  };

  const deleteEmployee = (id) => {
    // Soft delete usually preferred
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, status: "Terminated" } : emp))
    );
  };

  const login = (email, password) => {
    // In a real app, you would verify the password here.
    // For this mockup, we just find the user by email.
    const user = employees.find((emp) => emp.email === email);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Clock in / out logic (simplified for mockup, just creates a new session)
  const clockIn = (employeeId) => {
    const emp = employees.find((e) => e.id === employeeId);
    if (!emp) return;

    const log = {
      id: Date.now().toString(),
      employeeId,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      inOut: `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -> --:--`,
      activity: "1 punch cycles",
      totalWork: "0h 0m",
      lunchBreak: "0h 0m",
      shortBreak: "0h 0m",
      status: "Present",
      date: new Date().toLocaleDateString(),
    };
    setAttendanceLogs([log, ...attendanceLogs]);
  };

  const clockOut = (employeeId) => {
    // Ideally this would find the active log and update `inOut` out time and `totalWork`
    setAttendanceLogs((prev) => 
      prev.map((log) => {
        if (log.employeeId === employeeId && log.inOut.includes("--:--")) {
          const outTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            ...log,
            inOut: log.inOut.replace("--:--", outTime),
            totalWork: "Updated",
          };
        }
        return log;
      })
    );
  };

  const assignShift = (employeeId, shiftName) => {
    setShifts((prev) => {
      const exists = prev.find((s) => s.employeeId === employeeId);
      if (exists) {
        return prev.map((s) => s.employeeId === employeeId ? { ...s, shift: shiftName } : s);
      }
      return [...prev, { employeeId, shift: shiftName }];
    });
  };

  const value = {
    employees,
    attendanceLogs,
    shifts,
    currentUser,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    login,
    logout,
    clockIn,
    clockOut,
    assignShift,
  };

  return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>;
}

export function useStaff() {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error("useStaff must be used within a StaffProvider");
  }
  return context;
}
