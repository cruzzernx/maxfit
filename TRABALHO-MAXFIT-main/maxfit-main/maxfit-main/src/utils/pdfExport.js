import { jsPDF } from 'jspdf';

function header(doc, title) {
  doc.setFillColor(57, 255, 20);
  doc.rect(0, 0, 210, 18, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('MAXFIT', 10, 12);
  doc.setFontSize(11);
  doc.text(title, 105, 12, { align: 'center' });
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(9);
  doc.text(new Date().toLocaleDateString('pt-BR'), 200, 12, { align: 'right' });
  doc.setTextColor(0, 0, 0);
}

export function exportWorkoutPDF(workout, userName) {
  const doc = new jsPDF();
  header(doc, 'FICHA DE TREINO');

  let y = 28;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(workout.name, 10, y);
  y += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`Aluno: ${userName}  |  Categoria: ${workout.category}  |  Dias: ${workout.days.join(', ')}`, 10, y);
  y += 10;

  doc.setTextColor(0, 0, 0);
  doc.setFillColor(230, 230, 230);
  doc.rect(10, y, 190, 7, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('EXERCICIO', 12, y + 5);
  doc.text('SERIES', 100, y + 5);
  doc.text('REPS', 125, y + 5);
  doc.text('DESCANSO', 150, y + 5);
  doc.text('INTENSIDADE', 175, y + 5);
  y += 10;

  doc.setFont('helvetica', 'normal');
  workout.exercises.forEach((ex, i) => {
    if (y > 270) { doc.addPage(); header(doc, 'FICHA DE TREINO'); y = 28; }
    if (i % 2 === 0) { doc.setFillColor(248, 248, 248); doc.rect(10, y - 3, 190, 8, 'F'); }
    doc.setFontSize(9);
    doc.text(ex.name, 12, y + 2);
    doc.text(String(ex.sets || ''), 100, y + 2);
    doc.text(String(ex.reps || ''), 125, y + 2);
    doc.text(String(ex.rest || ''), 150, y + 2);
    doc.text(ex.intensity || '-', 175, y + 2);
    if (ex.obs) {
      y += 6;
      doc.setTextColor(120, 120, 120);
      doc.setFontSize(8);
      doc.text(`  ${ex.obs}`, 12, y + 2);
      doc.setTextColor(0, 0, 0);
    }
    y += 9;
  });

  doc.save(`treino-${workout.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
}

export function exportDietPDF(diet, userName) {
  const doc = new jsPDF();
  header(doc, 'FICHA DE DIETA');

  let y = 28;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(diet.name, 10, y);
  y += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`Aluno: ${userName}  |  Objetivo: ${diet.goal}  |  Meta: ${diet.calories} kcal/dia`, 10, y);
  y += 12;

  diet.meals.forEach(meal => {
    if (y > 260) { doc.addPage(); header(doc, 'FICHA DE DIETA'); y = 28; }
    doc.setFillColor(57, 255, 20);
    doc.rect(10, y, 190, 7, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${meal.time}  ${meal.name}`, 12, y + 5);
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    const foods = Array.isArray(meal.foods) ? meal.foods : meal.foods.split(',');
    foods.forEach(f => { doc.text(`- ${f.trim()}`, 14, y); y += 6; });
    y += 4;
  });

  doc.save(`dieta-${diet.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
}
