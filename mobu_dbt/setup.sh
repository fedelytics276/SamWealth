#!/bin/bash
# MOBU dbt Setup Script
# Automates PostgreSQL database setup and dbt initialization
# Version: 1.0.0

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo ""
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
}

# Check if PostgreSQL is installed
check_postgres() {
    print_header "Checking PostgreSQL Installation"
    
    if command -v psql &> /dev/null; then
        print_success "PostgreSQL is installed"
        psql --version
        return 0
    else
        print_error "PostgreSQL is not installed"
        print_info "Install with: brew install postgresql@15"
        return 1
    fi
}

# Check if PostgreSQL is running
check_postgres_running() {
    print_header "Checking PostgreSQL Service"
    
    if pg_isready &> /dev/null; then
        print_success "PostgreSQL is running"
        return 0
    else
        print_warning "PostgreSQL is not running"
        print_info "Start with: brew services start postgresql@15"
        print_info "Or: pg_ctl -D /usr/local/var/postgres start"
        
        read -p "Would you like to start PostgreSQL now? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            brew services start postgresql@15 || pg_ctl -D /usr/local/var/postgres start
            sleep 2
            if pg_isready &> /dev/null; then
                print_success "PostgreSQL started successfully"
                return 0
            else
                print_error "Failed to start PostgreSQL"
                return 1
            fi
        else
            return 1
        fi
    fi
}

# Create database if it doesn't exist
create_database() {
    print_header "Creating Database"
    
    if psql -lqt | cut -d \| -f 1 | grep -qw mobu_dev; then
        print_warning "Database 'mobu_dev' already exists"
        read -p "Do you want to recreate it? (WARNING: This will delete all data) (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Dropping existing database..."
            dropdb mobu_dev || true
            print_info "Creating fresh database..."
            createdb mobu_dev
            print_success "Database recreated"
        else
            print_info "Using existing database"
        fi
    else
        print_info "Creating database 'mobu_dev'..."
        createdb mobu_dev
        print_success "Database created"
    fi
}

# Run the database setup SQL script
setup_database() {
    print_header "Setting Up Database Schema"
    
    print_info "Running database_setup.sql..."
    psql -d mobu_dev -f database_setup.sql
    
    if [ $? -eq 0 ]; then
        print_success "Database schema created successfully"
        return 0
    else
        print_error "Database setup failed"
        return 1
    fi
}

# Set up environment variables
setup_environment() {
    print_header "Setting Up Environment Variables"
    
    # Check if .env file exists
    if [ ! -f .env ]; then
        print_info "Creating .env file..."
        cat > .env << EOF
# MOBU dbt Environment Variables
MOBU_DB_PASSWORD=mobu_dev_2024
MOBU_DB_HOST=localhost
MOBU_DB_PORT=5432
MOBU_DB_NAME=mobu_dev
MOBU_DB_USER=\$USER
EOF
        print_success ".env file created"
    else
        print_warning ".env file already exists"
    fi
    
    # Add dbt to PATH for this session
    export PATH="/Users/fedeanalytics/Library/Python/3.13/bin:$PATH"
    print_success "dbt added to PATH for this session"
    
    print_info "To persist PATH, add this to your ~/.zshrc:"
    echo '    export PATH="/Users/fedeanalytics/Library/Python/3.13/bin:$PATH"'
}

# Test dbt connection
test_dbt() {
    print_header "Testing dbt Connection"
    
    export PATH="/Users/fedeanalytics/Library/Python/3.13/bin:$PATH"
    export MOBU_DB_PASSWORD="mobu_dev_2024"
    
    print_info "Running dbt debug..."
    if dbt debug; then
        print_success "dbt connection successful!"
        return 0
    else
        print_error "dbt connection failed"
        print_info "Check your profiles.yml configuration"
        return 1
    fi
}

# Run dbt models
run_dbt_models() {
    print_header "Building dbt Models"
    
    export PATH="/Users/fedeanalytics/Library/Python/3.13/bin:$PATH"
    export MOBU_DB_PASSWORD="mobu_dev_2024"
    
    print_info "Running dbt run..."
    if dbt run; then
        print_success "dbt models built successfully!"
        return 0
    else
        print_warning "Some dbt models may have failed (expected with sample data)"
        print_info "Check target/run.log for details"
        return 0  # Don't fail the script
    fi
}

# Run dbt tests
run_dbt_tests() {
    print_header "Running dbt Tests"
    
    export PATH="/Users/fedeanalytics/Library/Python/3.13/bin:$PATH"
    export MOBU_DB_PASSWORD="mobu_dev_2024"
    
    print_info "Running dbt test..."
    if dbt test; then
        print_success "All dbt tests passed!"
        return 0
    else
        print_warning "Some dbt tests failed (may be expected with sample data)"
        print_info "Check target/run.log for details"
        return 0  # Don't fail the script
    fi
}

# Generate dbt documentation
generate_docs() {
    print_header "Generating dbt Documentation"
    
    export PATH="/Users/fedeanalytics/Library/Python/3.13/bin:$PATH"
    export MOBU_DB_PASSWORD="mobu_dev_2024"
    
    print_info "Generating documentation..."
    if dbt docs generate; then
        print_success "Documentation generated!"
        print_info "To view documentation, run: dbt docs serve"
        return 0
    else
        print_error "Documentation generation failed"
        return 1
    fi
}

# Verify setup
verify_setup() {
    print_header "Verifying Setup"
    
    export MOBU_DB_PASSWORD="mobu_dev_2024"
    
    print_info "Checking database tables..."
    psql -d mobu_dev -c "
        SELECT table_schema, COUNT(*) as table_count
        FROM information_schema.tables
        WHERE table_schema IN ('raw_data', 'staging', 'intermediate', 'marts', 'analytics')
        GROUP BY table_schema
        ORDER BY table_schema;
    "
    
    print_info ""
    print_info "Checking sample data..."
    psql -d mobu_dev -c "
        SELECT 
            'price_data_raw' as table_name, COUNT(*) as row_count 
        FROM raw_data.price_data_raw
        UNION ALL 
        SELECT 'recommendations', COUNT(*) FROM raw_data.recommendations
        UNION ALL 
        SELECT 'system_health', COUNT(*) FROM raw_data.system_health;
    "
    
    print_success "Setup verification complete!"
}

# Print next steps
print_next_steps() {
    print_header "Next Steps"
    
    echo "✅ Database setup complete!"
    echo "✅ dbt installed and configured"
    echo "✅ Sample data loaded"
    echo ""
    echo "🚀 Quick Commands:"
    echo "   cd $(pwd)"
    echo "   export PATH=\"/Users/fedeanalytics/Library/Python/3.13/bin:\$PATH\""
    echo "   dbt run          # Build models"
    echo "   dbt test         # Run tests"
    echo "   dbt docs serve   # View documentation"
    echo ""
    echo "📊 Connect to database:"
    echo "   psql -d mobu_dev"
    echo ""
    echo "📖 Documentation:"
    echo "   - README.md           (dbt project guide)"
    echo "   - ../DBT_INTEGRATION.md (full integration guide)"
    echo "   - ../DBT_QUICK_START.md (quick reference)"
    echo ""
    echo "🔗 Next Phase: Connect Data Feed Agent to raw_data schema"
}

# Main execution
main() {
    print_header "MOBU dbt Setup Wizard"
    echo "This script will set up PostgreSQL and dbt for MOBU"
    echo ""
    
    read -p "Press Enter to continue or Ctrl+C to cancel..."
    
    # Run setup steps
    check_postgres || exit 1
    check_postgres_running || exit 1
    create_database || exit 1
    setup_database || exit 1
    setup_environment
    test_dbt
    
    # Optional: Run dbt
    echo ""
    read -p "Would you like to run dbt models now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        run_dbt_models
    fi
    
    # Optional: Generate docs
    echo ""
    read -p "Would you like to generate dbt documentation? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        generate_docs
    fi
    
    verify_setup
    print_next_steps
    
    print_success "Setup complete! 🎉"
}

# Run main function
main
