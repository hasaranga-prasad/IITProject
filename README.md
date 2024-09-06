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
