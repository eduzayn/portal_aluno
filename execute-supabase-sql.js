// Script para executar SQL no Supabase usando a função exec_sql
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Credenciais do Supabase
const SUPABASE_URL = 'https://uasnyifizdjxogowijip.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';
const SUPABASE_TOKEN = 'sbp_057451a19b2fcdc89fc94ac28289e321ffc6e6a0';

// Função para executar SQL usando a função exec_sql
async function executeSql(sql) {
  try {
    console.log('Executando SQL no Supabase...');
    
    const response = await axios({
      method: 'POST',
      url: `${SUPABASE_URL}/rest/v1/rpc/exec_sql`,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      },
      data: {
        sql: sql
      }
    });
    
    console.log('Resposta:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao executar SQL:', error.response ? error.response.data : error.message);
    return { success: false, error: error.message };
  }
}

// Função para ler e executar um arquivo SQL
async function executeSqlFile(filePath) {
  try {
    console.log(`Lendo arquivo SQL: ${filePath}`);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Dividir o SQL em comandos separados por ponto e vírgula
    const commands = sql.split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0);
    
    console.log(`Encontrados ${commands.length} comandos SQL para executar.`);
    
    let results = [];
    
    // Executar cada comando separadamente
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      console.log(`Executando comando ${i+1}/${commands.length}...`);
      
      const result = await executeSql(command);
      results.push(result);
      
      // Se houver erro, parar a execução
      if (result.success === false) {
        console.error(`Erro ao executar comando ${i+1}:`, result.error);
        break;
      }
    }
    
    return results;
  } catch (error) {
    console.error('Erro ao ler ou executar arquivo SQL:', error);
    return [{ success: false, error: error.message }];
  }
}

// Função principal
async function main() {
  // Verificar argumentos
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Uso: node execute-supabase-sql.js <caminho-do-arquivo-sql>');
    process.exit(1);
  }
  
  const filePath = args[0];
  
  // Verificar se o arquivo existe
  if (!fs.existsSync(filePath)) {
    console.error(`Arquivo não encontrado: ${filePath}`);
    process.exit(1);
  }
  
  // Executar o arquivo SQL
  const results = await executeSqlFile(filePath);
  
  // Verificar resultados
  const success = results.every(result => result.success !== false);
  
  if (success) {
    console.log('Execução SQL concluída com sucesso!');
  } else {
    console.error('Execução SQL falhou. Verifique os erros acima.');
    process.exit(1);
  }
}

// Executar o script
main().catch(error => {
  console.error('Erro não tratado:', error);
  process.exit(1);
});
