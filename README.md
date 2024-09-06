# IITProject
Personal Finance Tracker application
spring.datasource.url=jdbc:mysql://localhost:3306/Personal_Finance_Tracker?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=ABcd@1234
Spring.jpa.show-sql = true
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl
spring.jpa.hibernate.ddl-auto=update
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.open-in-view=true


# Server port
server.port=8080


# Logback configuration
logging.level.root=info
logging.file.name=logs/myapp.log

# FrontEnd Angular
#JWT Using for UserManagements


To start an existing Angular project and install the necessary Node modules, follow these steps:

1.Navigate to the Project Directory: Open a terminal or command prompt, and navigate to the root directory of your Angular project where the package.json file is located.
#cd path/to/your-angular-project
2Install Node Modules: Run the following command to install the required packages (from package.json):
#npm install
3Start the Angular Development Server: Once the installation is complete, start the development server with this command:
#ng serve
Open in Browser: Open your browser and visit the local development server:
#http://localhost:4200

