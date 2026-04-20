import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

async function initDb() {
  const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  }

  const dbName = 'Ecom_Learn'

  console.log('--- Database Initialization ---')
  console.log(`Connecting to server: ${dbConfig.host}`)

  try {
    // 1. Create connection to server
    const connection = await mysql.createConnection(dbConfig)
    
    // 2. Create database
    console.log(`Creating database "${dbName}" if it doesn't exist...`)
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`)
    await connection.query(`USE ${dbName}`)
    console.log('Database selected.')

    // 3. Helper to run SQL files
    const runSqlFile = async (filePath: string) => {
      console.log(`Executing ${path.basename(filePath)}...`)
      const sql = fs.readFileSync(filePath, 'utf8')
      
      // Split by semicolon but handle potential issues with semicolons inside strings
      // For simplicity, we'll split and execute one by one
      // Note: This simple split might fail if there are semicolons in strings/comments, 
      // but usually standard for schema files.
      const statements = sql
        .split(/;(?=(?:[^'"]|'[^']*'|"[^"]*")*$)/)
        .map(s => s.trim())
        .filter(s => s.length > 0)

      for (const statement of statements) {
        try {
          await connection.query(statement)
        } catch (err: any) {
          if (err.code === 'ER_DUP_KEY' || err.code === 'ER_DUP_ENTRY') {
            // Ignore duplicate errors during seeding
            continue
          }
          console.error(`Error in statement: ${statement.substring(0, 50)}...`)
          console.error(err)
          throw err
        }
      }
    }

    // 4. Run scripts
    const scriptsDir = path.join(process.cwd(), 'scripts')
    await runSqlFile(path.join(scriptsDir, '001-create-tables.sql'))
    await runSqlFile(path.join(scriptsDir, '002-seed-data.sql'))

    console.log('--- Database Initialization Complete! ---')
    await connection.end()
    process.exit(0)
  } catch (error) {
    console.error('--- Database Initialization Failed ---')
    console.error(error)
    process.exit(1)
  }
}

initDb()
