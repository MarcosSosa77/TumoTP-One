 // Asegurarse de que todo el DOM está cargado antes de asignar la función al botón
 document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('decodeButton').onclick = redirectAndDecode;
    document.getElementById('decodeOnly').onclick = decodeOnly;
    document.getElementById('redirectOnly').onclick = redirectOnly;
  });

  function generateFeedback(jsonData) {
    // Contamos la cantidad de bloques (blocks + coins)
    const blockCounts = {
      'Vertical': 0,
      'Horizontal': 0,
      'Stone': 0,
      'Death': 0,
      'Sand': 0,
      'Coins': jsonData.coins.length || 0,
      'Cup': jsonData.cup.length || 0
    };

    jsonData.blocks.forEach(block => {
      if (blockCounts.hasOwnProperty(block.type)) {
        blockCounts[block.type]++;
      }
    });

    // Cálculo de la cantidad total de bloques (solo blocks y coins)
    const totalBlocks = blockCounts['Vertical'] + blockCounts['Horizontal'] + blockCounts['Stone'] + blockCounts['Death'] + blockCounts['Sand'] + blockCounts['Coins'];

    // Verificación de la presencia de bloques clave (sand, stone, death, y horizontal/vertical)
    const requiredBlocksPresent = ['Stone', 'Death', 'Sand'].every(type => blockCounts[type] > 0) && 
                                  (blockCounts['Vertical'] > 0 || blockCounts['Horizontal'] > 0) && 
                                  jsonData.hasOwnProperty('coins');



    /*
    // Generamos el mensaje de retroalimentación en función de las condiciones
    let feedbackMessage = '';

    if (totalBlocks >= 10 && requiredBlocksPresent) {
      feedbackMessage = "Buen trabajo, me gustó mucho la progresión de la dificultad. ¡Felicitaciones!";
    } else if (totalBlocks >= 10 && !requiredBlocksPresent) {
      feedbackMessage = "Buen trabajo, intenta para la próxima variar un poco más en la selección de bloques.";
    } else if (totalBlocks < 10 && requiredBlocksPresent) {
      feedbackMessage = "Buen trabajo, intenta para la próxima extender la duración del nivel.";
    } else {
      feedbackMessage = "Buen trabajo, intenta para la próxima variar un poco la selección de bloques, además de extender la duración del nivel.";
    }

    */

    let feedbackMessage = "Buen trabajo.";
let additionalMessages = [];

if (totalBlocks < 10) {
  additionalMessages.push("Intentá extender la duración del nivel (agregá más bloques).");
}

// Revisa qué bloques clave faltan
const missingTypes = [];

if (blockCounts['Stone'] === 0) missingTypes.push("Piedras");
if (blockCounts['Death'] === 0) missingTypes.push("Pinchos");
if (blockCounts['Sand'] === 0) missingTypes.push("Arena");

if (blockCounts['Vertical'] === 0 && blockCounts['Horizontal'] === 0) {
  missingTypes.push("Horizontal o Vertical");
}

if (!jsonData.hasOwnProperty('coins') || blockCounts['Coins'] === 0) {
  missingTypes.push("Coins");
}

if (missingTypes.length > 0) {
  additionalMessages.push("Faltan bloques del tipo: " + missingTypes.join(", ") + ".");
} else if (totalBlocks >= 10) {
  feedbackMessage = "Buen trabajo, me gustó mucho la progresión de la dificultad. ¡Felicitaciones!";
}

if (additionalMessages.length > 0) {
  feedbackMessage += " " + additionalMessages.join(" ");
}


    const oldFeedback = document.querySelector('.feedback-container');
    if (oldFeedback) oldFeedback.remove();

    // Mostrar el mensaje de retroalimentación con el botón para copiar al portapapeles
    const feedbackContainer = document.createElement('div');
    feedbackContainer.classList.add('feedback-container');
    
    // Contenedor del mensaje de retroalimentación
    const messageElement = document.createElement('div');
    messageElement.classList.add('feedback-message');
    messageElement.innerHTML = `<h3>Retroalimentación:</h3><p>${feedbackMessage}</p>`;
    
    // Botón de copiar
    const copyButton = document.createElement('button');
    copyButton.classList.add('copy-button');
    copyButton.textContent = 'Copiar al portapapeles';

    // Función para copiar el feedback al portapapeles
    copyButton.onclick = function() {
      navigator.clipboard.writeText(feedbackMessage)
        .then(() => alert('¡Retroalimentación copiada al portapapeles!'))
        .catch(err => alert('No se pudo copiar al portapapeles: ' + err));
    };

    feedbackContainer.appendChild(messageElement);
    feedbackContainer.appendChild(copyButton);
    document.body.prepend(feedbackContainer);
  }

function redirectAndDecode() {
const code = document.getElementById('codeInput').value.trim();
if (!code) {
  alert('Por favor pega un código válido.');
  return;
}

// 1. Decodificar Base64
const decodedBase64 = atob(code);

// 2. Decodificar URL
const decodedUrl = decodeURIComponent(decodedBase64);

// 3. Parsear el JSON
let jsonData;
try {
  jsonData = JSON.parse(decodedUrl);
} catch (e) {
  alert('El código no es un JSON válido.');
  return;
}

// 4. Redirigir a la URL
const baseUrl = 'https://tumo-product.github.io/PlatformGames/es_AR.html?data=';
const fullUrl = baseUrl + encodeURIComponent(code);
window.open(fullUrl, '_blank'); // Abre en pestaña nueva

// 5. Mostrar las tablas solo después de procesar correctamente el JSON
document.getElementById('blocksTableContainer').style.display = 'block';

// 6. Generar retroalimentación
generateFeedback(jsonData);

showTypesCheckTable(jsonData);
showBlockCountTable(jsonData);
showRawJsonTable(jsonData);


}
function decodeOnly() {
const code = document.getElementById('codeInput').value.trim();
if (!code) {
  alert('Por favor pega un código válido.');
  return;
}

// 1. Decodificar Base64
const decodedBase64 = atob(code);

// 2. Decodificar URL
const decodedUrl = decodeURIComponent(decodedBase64);

// 3. Parsear el JSON
let jsonData;
try {
  jsonData = JSON.parse(decodedUrl);
} catch (e) {
  alert('El código no es un JSON válido.');
  return;
}



// 5. Mostrar las tablas solo después de procesar correctamente el JSON
document.getElementById('blocksTableContainer').style.display = 'block';

// 6. Generar retroalimentación
generateFeedback(jsonData);

//showTypesCheckTable(jsonData);
//showBlockCountTable(jsonData);

showCombinedBlockTable(jsonData);

showRawJsonTable(jsonData);
}
  function redirectOnly() {
const code = document.getElementById('codeInput').value.trim();
if (!code) {
  alert('Por favor pega un código válido.');
  return;
}


// 4. Redirigir a la URL
const baseUrl = 'https://tumo-product.github.io/PlatformGames/es_AR.html?data=';
const fullUrl = baseUrl + encodeURIComponent(code);
window.open(fullUrl, '_blank'); // Abre en pestaña nueva
}


/*
  
  function showTypesCheckTable(jsonData) {
    const requiredTypes = ['Vertical', 'Horizontal', 'Stone', 'Death', 'Sand'];
    const typesPresence = {};

    // Inicializar todos los tipos como false
    requiredTypes.forEach(type => {
      typesPresence[type] = false;
    });

    // Comprobar si cada tipo de bloque está presente en jsonData.blocks
    jsonData.blocks.forEach(block => {
      if (requiredTypes.includes(block.type)) {
        typesPresence[block.type] = true;
      }
    });

    // Verificar si Cup y Coins están presentes
    const hasCup = jsonData.hasOwnProperty('Cup');
    const hasCoins = jsonData.hasOwnProperty('coins');
    
    const allBlocksPresent = requiredTypes.every(type => typesPresence[type]) && hasCup && hasCoins;

    // Cambiar el emoji dependiendo de si todo está presente
    const statusEmoji = allBlocksPresent ? '👍' : '👎';

    const tableBody = document.querySelector('#typesCheckTable tbody');
    tableBody.innerHTML = ''; // Limpiar la tabla antes de llenarla

    // Mostrar todos los tipos de bloques y su estado
    requiredTypes.forEach(type => {
      const row = document.createElement('tr');
      const typeCell = document.createElement('td');
      typeCell.textContent = type;
      row.appendChild(typeCell);

      const statusCell = document.createElement('td');
      statusCell.textContent = typesPresence[type] ? '👍' : '👎';
      row.appendChild(statusCell);

      tableBody.appendChild(row);
    });

    // Agregar Cup y Coins a la tabla
    const cupRow = document.createElement('tr');
    cupRow.innerHTML = `<td>Cup</td><td>${hasCup ? '👍' : '👎'}</td>`;
    tableBody.appendChild(cupRow);

    const coinsRow = document.createElement('tr');
    coinsRow.innerHTML = `<td>Coins</td><td>${hasCoins ? '👍' : '👎'}</td>`;
    tableBody.appendChild(coinsRow);

    // Agregar estado general
    const statusRow = document.createElement('tr');
    statusRow.innerHTML = `<td><strong>Todo Presente</strong></td><td>${statusEmoji}</td>`;
    tableBody.appendChild(statusRow);
  }

  function showBlockCountTable(jsonData) {
    const blockCounts = {
      'Vertical': 0,
      'Horizontal': 0,
      'Stone': 0,
      'Death': 0,
      'Sand': 0,
      'Coins': jsonData.coins.length || 0,
      'Cup': jsonData.cup.length || 0
    };

    // Contar la cantidad de bloques de cada tipo
    jsonData.blocks.forEach(block => {
      if (blockCounts.hasOwnProperty(block.type)) {
        blockCounts[block.type]++;
      }
    });


    const tableBody = document.querySelector('#blockCountTable tbody');
    tableBody.innerHTML = ''; // Limpiar la tabla antes de llenarla

    let totalNormalBlocks = 0;

    for (const type in blockCounts) {
      if (blockCounts.hasOwnProperty(type)) {
        const row = document.createElement('tr');
        const typeCell = document.createElement('td');
        typeCell.textContent = type;
        row.appendChild(typeCell);

        const countCell = document.createElement('td');
        countCell.textContent = blockCounts[type];
        row.appendChild(countCell);

        tableBody.appendChild(row);

        // Sumar los totales
        if (type !== 'Coins' && type !== 'Cup') {
          totalNormalBlocks += blockCounts[type];
        }
      }
    }

    // Agregar las filas de totales
    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `<td><strong>Total Bloques (sin COINS y CUP)</strong></td><td>${totalNormalBlocks}</td>`;
    tableBody.appendChild(totalRow);

    const coinsRow = document.createElement('tr');
    coinsRow.innerHTML = `<td><strong>Total de COINS</strong></td><td>${blockCounts['Coins']}</td>`;
    tableBody.appendChild(coinsRow);

    const cupRow = document.createElement('tr');
    cupRow.innerHTML = `<td><strong>Total de CUP</strong></td><td>${blockCounts['Cup']}</td>`;
    tableBody.appendChild(cupRow);

    const finalTotalRow = document.createElement('tr');
    finalTotalRow.innerHTML = `<td><strong>Total (normal + COINS + CUP)</strong></td><td>${totalNormalBlocks + blockCounts['Coins'] + blockCounts['Cup']}</td>`;
    tableBody.appendChild(finalTotalRow);
  }


  */


//-----------MCS-------------------
function showCombinedBlockTable(jsonData) {
    const requiredTypes = ['Vertical', 'Horizontal', 'Stone', 'Death', 'Sand'];
    const typesPresence = {};
    const blockCounts = {
      'Vertical': 0,
      'Horizontal': 0,
      'Stone': 0,
      'Death': 0,
      'Sand': 0
    };
  
    // Inicializar
    requiredTypes.forEach(type => {
      typesPresence[type] = false;
      blockCounts[type] = 0;
    });
  
    // Recorrer los bloques
    jsonData.blocks.forEach(block => {
      if (requiredTypes.includes(block.type)) {
        typesPresence[block.type] = true;
        blockCounts[block.type]++;
      }
    });
  
    // Cup y Coins
    const hasCup = jsonData.hasOwnProperty('Cup') && Array.isArray(jsonData.Cup);
    const hasCoins = jsonData.hasOwnProperty('coins') && Array.isArray(jsonData.coins);
    const cupCount = hasCup ? jsonData.Cup.length : 0;
    const coinsCount = hasCoins ? jsonData.coins.length : 0;
  
    const allBlocksPresent = requiredTypes.every(type => typesPresence[type]) && hasCup && hasCoins;
    const statusEmoji = allBlocksPresent ? '👍' : '👎';
  
    const tableBody = document.querySelector('#combinedTable tbody');
    tableBody.innerHTML = ''; // Limpiar
  
    // Agregar filas de tipos requeridos
    requiredTypes.forEach(type => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${type}</td>
        <td>${typesPresence[type] ? '👍' : '👎'}</td>
        <td>${blockCounts[type]}</td>
      `;
      tableBody.appendChild(row);
    });
  
    // Agregar fila Cup
    const cupRow = document.createElement('tr');
    cupRow.innerHTML = `
      <td>Cup</td>
      <td>${hasCup ? '👍' : '👎'}</td>
      <td>${cupCount}</td>
    `;
    tableBody.appendChild(cupRow);
  
    // Agregar fila Coins
    const coinsRow = document.createElement('tr');
    coinsRow.innerHTML = `
      <td>Coins</td>
      <td>${hasCoins ? '👍' : '👎'}</td>
      <td>${coinsCount}</td>
    `;
    tableBody.appendChild(coinsRow);
  
    // Agregar fila de estado general
    const statusRow = document.createElement('tr');
    statusRow.innerHTML = `
      <td><strong>Todo Presente</strong></td>
      <td colspan="2">${statusEmoji}</td>
    `;
    tableBody.appendChild(statusRow);
  }
  

    //-----------MCS-------------------






  function showRawJsonTable(jsonData) {
const container = document.getElementById('rawJsonTable');
container.innerHTML = ''; // Limpiar el contenedor de las tablas

// Secciones del JSON que queremos mostrar
const sections = ['blocks', 'camera', 'player', 'coins', 'cup'];

// Recorrer las secciones
sections.forEach(section => {
  if (jsonData.hasOwnProperty(section)) {
    // Crear una tabla general para cada sección
    const sectionTable = document.createElement('table');
    sectionTable.innerHTML = `
      <thead>
        <tr>
          <th>Clave</th>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const tableBody = sectionTable.querySelector('tbody');
    const sectionData = jsonData[section];

    // Título para la tabla de la sección
    const sectionTitle = document.createElement('h3');
    sectionTitle.textContent = `Detalles de la sección: ${section.charAt(0).toUpperCase() + section.slice(1)}`;
    container.appendChild(sectionTitle);

    // Si es la sección de "blocks", crear subtablas para cada atributo (x, y, type, editRange)
    if (section === 'blocks') {
      const subTable = document.createElement('table');
      subTable.innerHTML = `
        <thead>
          <tr>
            <th>X</th>
            <th>Y</th>
            <th>Type</th>
            <th>EditRange</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;
      const subTableBody = subTable.querySelector('tbody');

      // Recorrer los bloques y mostrar valores separados por atributos
      sectionData.forEach(block => {
        const row = document.createElement('tr');

        const xCell = document.createElement('td');
        xCell.textContent = block.x;
        row.appendChild(xCell);

        const yCell = document.createElement('td');
        yCell.textContent = block.y;
        row.appendChild(yCell);

        const typeCell = document.createElement('td');
        typeCell.textContent = block.type;
        row.appendChild(typeCell);

        const editRangeCell = document.createElement('td');
        editRangeCell.textContent = block.editRange || 'N/A'; // Si no tiene valor, mostramos N/A
        row.appendChild(editRangeCell);

        subTableBody.appendChild(row);
      });

      container.appendChild(subTable);
    } else {
      // Para las demás secciones (camera, player, coins, cup), mostrar claves y valores
      for (const key in sectionData) {
        if (sectionData.hasOwnProperty(key)) {
          const row = document.createElement('tr');

          const keyCell = document.createElement('td');
          keyCell.textContent = key;
          row.appendChild(keyCell);

          const valueCell = document.createElement('td');
          valueCell.textContent = typeof sectionData[key] === 'object' 
            ? JSON.stringify(sectionData[key], null, 2) 
            : sectionData[key];
          row.appendChild(valueCell);

          tableBody.appendChild(row);
        }
      }
      container.appendChild(sectionTable);
    }

    container.appendChild(document.createElement('hr')); // Separador entre tablas
  }
});
}
