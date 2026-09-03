package com.hexaware.employeeskillsummary.controller;

import com.hexaware.employeeskillsummary.entity.Employee;
import com.hexaware.employeeskillsummary.service.EmployeeService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final EmployeeService employeeService;

    public AdminController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    // =====================================================
    // ADMIN DASHBOARD
    // =====================================================

    @GetMapping("/dashboard")
    public String adminDashboard(
            @RequestParam(required = false, defaultValue = "") String keyword,
            @RequestParam(required = false, defaultValue = "") String department,
            @RequestParam(required = false, defaultValue = "") String skillLevel,
            @RequestParam(required = false, defaultValue = "") String trainingNeeded,
            Model model) {

        List<Employee> allEmployees =
                employeeService.getAllEmployees();

        int totalEmployees = allEmployees.size();

        // =====================================================
        // DEPARTMENT COUNTS
        // =====================================================

        long itEmployees = allEmployees.stream()
                .filter(e -> "IT".equalsIgnoreCase(e.getDepartment()))
                .count();

        long hrEmployees = allEmployees.stream()
                .filter(e -> "HR".equalsIgnoreCase(e.getDepartment()))
                .count();

        long financeEmployees = allEmployees.stream()
                .filter(e -> "Finance".equalsIgnoreCase(e.getDepartment()))
                .count();

        long marketingEmployees = allEmployees.stream()
                .filter(e -> "Marketing".equalsIgnoreCase(e.getDepartment()))
                .count();

        long salesEmployees = allEmployees.stream()
                .filter(e -> "Sales".equalsIgnoreCase(e.getDepartment()))
                .count();

        long operationsEmployees = allEmployees.stream()
                .filter(e -> "Operations".equalsIgnoreCase(e.getDepartment()))
                .count();

        // =====================================================
        // SKILL LEVEL COUNTS
        // =====================================================

        long beginnerEmployees = allEmployees.stream()
                .filter(e -> "Beginner".equalsIgnoreCase(e.getSkillLevel()))
                .count();

        long intermediateEmployees = allEmployees.stream()
                .filter(e -> "Intermediate".equalsIgnoreCase(e.getSkillLevel()))
                .count();

        long advancedEmployees = allEmployees.stream()
                .filter(e -> "Advanced".equalsIgnoreCase(e.getSkillLevel()))
                .count();

        long expertEmployees = allEmployees.stream()
                .filter(e -> "Expert".equalsIgnoreCase(e.getSkillLevel()))
                .count();

        // =====================================================
        // TRAINING COUNTS
        // =====================================================

        long trainingRequired = allEmployees.stream()
                .filter(e -> "Yes".equalsIgnoreCase(e.getTrainingNeeded()))
                .count();

        long trainingNotRequired = allEmployees.stream()
                .filter(e -> "No".equalsIgnoreCase(e.getTrainingNeeded()))
                .count();

        // =====================================================
        // SEARCH AND FILTER
        // =====================================================

        String searchKeyword = keyword.trim();
        String searchDepartment = department.trim();
        String searchSkillLevel = skillLevel.trim();
        String searchTrainingNeeded = trainingNeeded.trim();

        List<Employee> filteredEmployees = allEmployees.stream()

                .filter(e ->
                        searchKeyword.isEmpty()
                                || (e.getName() != null
                                && e.getName()
                                .toLowerCase()
                                .contains(searchKeyword.toLowerCase()))
                )

                .filter(e ->
                        searchDepartment.isEmpty()
                                || "All".equalsIgnoreCase(searchDepartment)
                                || (e.getDepartment() != null
                                && e.getDepartment()
                                .equalsIgnoreCase(searchDepartment))
                )

                .filter(e ->
                        searchSkillLevel.isEmpty()
                                || "All".equalsIgnoreCase(searchSkillLevel)
                                || (e.getSkillLevel() != null
                                && e.getSkillLevel()
                                .equalsIgnoreCase(searchSkillLevel))
                )

                .filter(e ->
                        searchTrainingNeeded.isEmpty()
                                || "All".equalsIgnoreCase(searchTrainingNeeded)
                                || (e.getTrainingNeeded() != null
                                && e.getTrainingNeeded()
                                .equalsIgnoreCase(searchTrainingNeeded))
                )

                .collect(Collectors.toList());

        // =====================================================
        // SEND DATA TO THYMELEAF
        // =====================================================

        model.addAttribute("employees", filteredEmployees);

        model.addAttribute("totalEmployees", totalEmployees);

        model.addAttribute("itEmployees", itEmployees);
        model.addAttribute("hrEmployees", hrEmployees);
        model.addAttribute("financeEmployees", financeEmployees);
        model.addAttribute("marketingEmployees", marketingEmployees);
        model.addAttribute("salesEmployees", salesEmployees);
        model.addAttribute("operationsEmployees", operationsEmployees);

        model.addAttribute("beginnerEmployees", beginnerEmployees);
        model.addAttribute("intermediateEmployees", intermediateEmployees);
        model.addAttribute("advancedEmployees", advancedEmployees);
        model.addAttribute("expertEmployees", expertEmployees);

        model.addAttribute("trainingRequired", trainingRequired);
        model.addAttribute("trainingNotRequired", trainingNotRequired);

        model.addAttribute("keyword", keyword);
        model.addAttribute("department", department);
        model.addAttribute("skillLevel", skillLevel);
        model.addAttribute("trainingNeeded", trainingNeeded);

        model.addAttribute(
                "filteredCount",
                filteredEmployees.size()
        );

        return "admin_dashboard";
    }

    // =====================================================
    // EXPORT EMPLOYEES TO CSV
    // =====================================================

    @GetMapping("/export")
    public void exportCsv(HttpServletResponse response)
            throws IOException {

        List<Employee> employees =
                employeeService.getAllEmployees();

        response.setContentType("text/csv");
        response.setCharacterEncoding("UTF-8");

        response.setHeader(
                "Content-Disposition",
                "attachment; filename=employees_skills_summary.csv"
        );

        PrintWriter writer = response.getWriter();

        writer.println(
                "ID,Name,Email,Department,Skills,Skill Level,Training Needed"
        );

        for (Employee employee : employees) {

            writer.println(
                    csvValue(employee.getId())
                            + ","
                            + csvValue(employee.getName())
                            + ","
                            + csvValue(employee.getEmail())
                            + ","
                            + csvValue(employee.getDepartment())
                            + ","
                            + csvValue(employee.getSkills())
                            + ","
                            + csvValue(employee.getSkillLevel())
                            + ","
                            + csvValue(employee.getTrainingNeeded())
            );
        }

        writer.flush();
    }

    // =====================================================
    // CSV VALUE HELPER
    // =====================================================

    private String csvValue(Object value) {

        if (value == null) {
            return "";
        }

        String text = value.toString();

        text = text.replace("\"", "\"\"");

        return "\"" + text + "\"";
    }

    // =====================================================
    // EXPORT EMPLOYEES TO EXCEL
    // =====================================================

    @GetMapping("/export/excel")
    public void exportExcel(HttpServletResponse response)
            throws IOException {

        List<Employee> employees =
                employeeService.getAllEmployees();

        Workbook workbook = new XSSFWorkbook();

        Sheet sheet =
                workbook.createSheet("Employees");

        // =====================================================
        // HEADER ROW
        // =====================================================

        Row headerRow = sheet.createRow(0);

        headerRow.createCell(0).setCellValue("ID");
        headerRow.createCell(1).setCellValue("Name");
        headerRow.createCell(2).setCellValue("Email");
        headerRow.createCell(3).setCellValue("Department");
        headerRow.createCell(4).setCellValue("Skills");
        headerRow.createCell(5).setCellValue("Skill Level");
        headerRow.createCell(6).setCellValue("Training Needed");

        // =====================================================
        // EMPLOYEE DATA
        // =====================================================

        int rowNumber = 1;

        for (Employee employee : employees) {

            Row row = sheet.createRow(rowNumber++);

            row.createCell(0)
                    .setCellValue(
                            employee.getId() != null
                                    ? employee.getId()
                                    : 0
                    );

            row.createCell(1)
                    .setCellValue(
                            employee.getName() != null
                                    ? employee.getName()
                                    : ""
                    );

            row.createCell(2)
                    .setCellValue(
                            employee.getEmail() != null
                                    ? employee.getEmail()
                                    : ""
                    );

            row.createCell(3)
                    .setCellValue(
                            employee.getDepartment() != null
                                    ? employee.getDepartment()
                                    : ""
                    );

            row.createCell(4)
                    .setCellValue(
                            employee.getSkills() != null
                                    ? employee.getSkills()
                                    : ""
                    );

            row.createCell(5)
                    .setCellValue(
                            employee.getSkillLevel() != null
                                    ? employee.getSkillLevel()
                                    : ""
                    );

            row.createCell(6)
                    .setCellValue(
                            employee.getTrainingNeeded() != null
                                    ? employee.getTrainingNeeded()
                                    : ""
                    );
        }

        // =====================================================
        // AUTO SIZE COLUMNS
        // =====================================================

        for (int i = 0; i < 7; i++) {
            sheet.autoSizeColumn(i);
        }

        // =====================================================
        // DOWNLOAD SETTINGS
        // =====================================================

        response.setContentType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        response.setHeader(
                "Content-Disposition",
                "attachment; filename=employees_skills_summary.xlsx"
        );

        // =====================================================
        // WRITE EXCEL FILE
        // =====================================================

        workbook.write(response.getOutputStream());

        workbook.close();
    }

    // =====================================================
    // ADMIN ADD EMPLOYEE PAGE
    // =====================================================

    @GetMapping("/add")
    public String showAddEmployeeForm(Model model) {

        model.addAttribute(
                "employee",
                new Employee()
        );

        return "add_employee";
    }

    // =====================================================
    // ADMIN SAVE EMPLOYEE
    // =====================================================

    @PostMapping("/save")
    public String saveEmployee(
            @Valid @ModelAttribute("employee") Employee employee,
            BindingResult bindingResult) {

        // If validation fails, return to the same form
        if (bindingResult.hasErrors()) {
            return "add_employee";
        }

        employeeService.saveEmployee(employee);

        return "redirect:/admin/dashboard";
    }

    // =====================================================
    // ADMIN EDIT EMPLOYEE PAGE
    // =====================================================

    @GetMapping("/edit/{id}")
    public String showEditEmployeeForm(
            @PathVariable("id") Long id,
            Model model) {

        Employee employee =
                employeeService.getEmployeeById(id);

        if (employee == null) {
            return "redirect:/admin/dashboard";
        }

        model.addAttribute(
                "employee",
                employee
        );

        return "edit_employee";
    }

    // =====================================================
    // ADMIN UPDATE EMPLOYEE
    // =====================================================

    @PostMapping("/update/{id}")
    public String updateEmployee(
            @PathVariable("id") Long id,
            @Valid @ModelAttribute("employee") Employee employee,
            BindingResult bindingResult) {

        // Keep the existing employee ID
        employee.setId(id);

        // If validation fails, return to edit page
        if (bindingResult.hasErrors()) {
            return "edit_employee";
        }

        employeeService.updateEmployee(employee);

        return "redirect:/admin/dashboard";
    }

    // =====================================================
    // ADMIN DELETE EMPLOYEE
    // =====================================================

    @GetMapping("/delete/{id}")
    public String deleteEmployee(
            @PathVariable("id") Long id) {

        employeeService.deleteEmployee(id);

        return "redirect:/admin/dashboard";
    }
}