Фрагмент скрипта Basketball

// версия 1.3 с автологином

// сделать счёт по каждой игре в каждом ТЗ свой

//***********************************************************************************************************************

// 1. Cекция глобальные переменные

//***********************************************************************************************************************

path = "C:\\iMacros\\Macros\\1xbet\\" // Путь где лежит парсер и происходят все сохранения

file_output_error = "file_output_error"; // файл сохранения детальных сведений об ошибках для повторной проходки, добавлять при сохранении файла в конце .txt не забыть, .txt не вписан, так как имя может дополняться ключевой фразой

file_output1 = "file_outputT3_1"; // куда сохранять результаты работы, ТЗ1

file_output2 = "file_outputT3_2"; // куда сохранять результаты работы, ТЗ2

file_output3 = "file_outputT3_3"; // куда сохранять результаты работы, ТЗ3

file_output4 = "file_outputT3_4"; // куда сохранять результаты работы, ТЗ4

file_output5 = "file_outputT3_5"; // куда сохранять результаты работы, ТЗ5

file_win1 = "file_winT3_1"; // куда сохранять результаты работы, ТЗ1

file_win2 = "file_winT3_2"; // куда сохранять результаты работы, ТЗ2

file_win3 = "file_winT3_3"; // куда сохранять результаты работы, ТЗ3

file_win4 = "file_winT3_4"; // куда сохранять результаты работы, ТЗ4

file_win5 = "file_winT3_5"; // куда сохранять результаты работы, ТЗ5

file_temp = "temp"; // имя временного файла для сохранения результатов, при считывании добавлять расширение .htm так как команда записи SAVEAS пишет сразу с расширением

TZ4 = 1 // 1- включено ТЗ4, 0 - отключено

score_period2 = 20 // разница очков по второму ТЗ между тремя периодами

score_period3 = 6 // разница очков по третьему тз меньше либо равно

score_period41 = 0.8 // 20% разница между очками первых двух четвертей и Т1 и Т2

score_period42 = 10 // разница между первой и второй четвертью более 10 очков по default

score_period5 = 20 // разница между первой и второй четвертью более 20 очков по default

koef_how = 0.3 // разница коэффициента до 3 при поиске форы и тотала

koef_how2 = 0.3 // разница коэффициента до 1.9 при поиске результирующего тотала

pause_stake = 5 // пауза после ставки

time_refresh = 300

time_ok = 3

time_parse = 15 // время парсенья в секундах тотала 1.9 и 3

bet1 = 10 // ставка

//***********************************************************************************************************************

// 1. Конец секции глобальные переменные

//***********************************************************************************************************************

//***********************************************************************************************************************

// 2. Секция функции

//***********************************************************************************************************************

//***********************************************************************************************************************

// 2.0 Функция остановки скрипта клавишей STOP можно применять в любых роботах

// ОБРАТИТЬ ВНИМАНИЕ!!!

// (iimGetLastError()=="OK") - обратить внимание, теперь ошибка выполнения iMacros берётся только по ОК - т.е. выполнен был код без ошибок

// нельзя присваивать temp, проверяем так : (перед if идёт iimPlayCode) if (iimGetLastError()=="OK") // если вкладка Партия есть то ищем далее ставку 3:0

function iimPlayCode(code) {

var Cc = Components.classes,

Ci = Components.interfaces,

wm = Cc["@mozilla.org/appshell/window-mediator;1"]

.getService(Ci.nsIWindowMediator)

.getMostRecentWindow("navigator:browser");

iimPlay('CODE:' + code);

if (iimGetLastError() == 'Macro stopped manually') {

window.setTimeout(function() {

wm.iMacros.panel.sidebar.

document.getElementById('message-box-button-close').click()

} , 4);

throw 'Скрипт остановлен кнопкой стоп!';

}

};

// 2.0 конец Функции остановки скрипта клавишей STOP можно применять в любых роботах

//***************************************

//***********************************************************************************************************************

// 2.1 Функция осхранения данных по средствам imacros

function save(data, filename)

{

iimSet("SAVE",data);iimPlayCode("ADD !EXTRACT {{SAVE}}\nSAVEAS TYPE=EXTRACT FOLDER=" + path + " FILE=" + filename)

}

// 2.1 конец Функция осхранения данных по средствам imacros

//***************************************

//***************************************

//***************************************

//***************************************

// Функция вывода тотала и форы кэффа

function get_koef(_part,stake_type) // функция парсенья матча по событию, _part= 0 (берём и 1.9 и 3.0); =1 при кэффе берём тоталы 1.9; =2 при кэфе 3 берём тоталы и фору

{

// открываем вторую вкладку

iimPlay("CODE:TAB OPEN")

Tabs.go(2)

iimPlay("CODE:URL GOTO="+url[section_now])

iimPlay("CODE:WAIT SECONDS = 3") // ждём загрузки основного окна, для ТОРА побольше

// открываем текущую четверть

macro = "CODE:"

macro += 'EVENT TYPE=CLICK SELECTOR="#dopEvsWrap_select_chosen>A>DIV>B" BUTTON=0' + '\n'

macro += 'EVENT TYPE=CLICK SELECTOR="#dopEvsWrap_select_chosen>DIV>UL>LI:nth-of-type(2)" BUTTON=0' + '\n'

iimPlay(macro)

iimPlay("CODE:WAIT SECONDS = 1") // ждём загрузки блока четверти текущего

// конец открытия текущей четверти, берём текущую четверть после Основное

dim = GetClass("bets betCols2") // берём весь результат

// Блок для коэффициента 1.9

if (_part == 1 || _part == 0)

{

_TOTAL = 0 // если данные не спарсили

_TOTAL_koef = 0

_trigger = 0

for (_i=0;_i<dim.length;_i++)

{

if (dim[_i].innerHTML.match(/span data-type="9"/) == 'span data-type="9"')

{

result = dim[_i].innerHTML.match(/\d{1,3}\.\d{1,3}/g)

for (_j=3;_j<result.length;_j+=6)// начинаем с 3-го элемента, это ТОТАЛЫ МЕНЬШЕ, кэфф элемент +1, перепрыгиваем +6 чтобы опять убрать ТОТАЛЫ больше

{

if (Math.abs(result[_j+1]-1.9) <= koef_how2)

{

temp_total = result[_j] + "М"

temp_total_koef = result[_j+1]

_trigger = 1

break // выходим из цикла

}

}

break

}

}

_TOTAL = result[_j] // _TOTAL усреднёный _TOTAL для всех матчей с 1.9

_TOTAL_koef = result[_j+1] // Коэффициент усреднёного тотала

} // конец _part == 1 или == 0

// Блок для коэффициента 3

if (_part == 2 || _part == 0)

{

// блок считывания ТОТАЛА и ФОРЫ

temp_total = 0

temp_total_koef = 0

temp_fora = 0

temp_fora_koef = 0

_trigger = 0

// БЛОК ТОТАЛА

for (_i=0;_i<dim.length;_i++)

{

if (dim[_i].innerHTML.match(/span data-type="9"/) == 'span data-type="9"')

{

result = dim[_i].innerHTML.match(/\d{1,3}\.\d{1,3}/g)

for (_j=3;_j<result.length;_j+=6)// начинаем с 3-го элемента, это ТОТАЛЫ МЕНЬШЕ, кэфф элемент +1, перепрыгиваем +6 чтобы опять убрать ТОТАЛЫ больше

{

if (Math.abs(result[_j+1]-3) <= koef_how )

{

temp_total = result[_j] + "М"

temp_total_koef = result[_j+1]

_trigger = 1

if (stake_type == 1) // если 1 то тоталы, 2 то форы

{

get_one_click()

get_stake(bet1)

// подблок поиска события для ставки

bet = GetClass("bet_type")

for (l=0;l<bet.length;l++)

{

if (bet[l].textContent.match(/\d{2}\.5 М/) == (result[_j] + " М")) // сравнение найденного тотала

{

bet[l].focus()

bet[l].click()

}

}

iimPlayCode("WAIT SECONDS = " + pause_stake)

iimPlayCode("TAG POS=1 TYPE=BUTTON ATTR=TXT:ОК")

}

break // выходим из цикла

}

}

break

}

}

// БЛОК ФОРЫ

for (_i=0;_i<dim.length;_i++)

{

if (dim[_i].innerHTML.match(/span data-type="7"/) == 'span data-type="7"') // берём ФОРУ данные 7-я секция

{

result = dim[_i].innerHTML.match(/\d{1,3}\.\d{1,3}/g)

for (_j=0;_j<result.length;_j+=3) // рассматриваем ФОРУ, все элементы

{

if (Math.abs(result[_j+1]-3) <= koef_how )

{

temp_fora = result[_j]

temp_fora_koef = result[_j+1]

if (stake_type == 2) // если 1 то тоталы, 2 то форы

{

get_one_click()

get_stake(bet1)

// подблок поиска события для ставки

bet = GetClass("bet_type")

for (l=0;l<bet.length;l++)

{

if (bet[l].textContent.match(/1 .\d{1,2}\.5/) == ("1 -" + result[_j]) || bet[l].textContent.match(/1 .\d{1,2}\.5/) == ("1 " + result[_j]) || bet[l].textContent.match(/2 .\d{1,2}\.5/) == ("2 -" + result[_j]) || bet[l].textContent.match(/2 .\d{1,2}\.5/) == ("2 " + result[_j])) // сравнение найденного тотала

{

bet[l].focus()

bet[l].click()

}

}

iimPlayCode("WAIT SECONDS = " + pause_stake)

iimPlayCode("TAG POS=1 TYPE=BUTTON ATTR=TXT:ОК")

}

break // выходим из цикла

}

}

break

}

}

// присваиваем текущее значение для тоталов для кэффа 3 +- koef_how

if (total[section_now] == 0 || total[section_now] == undefined || total[section_now] == null)

{

total[section_now] = temp_total;

}

if (total_koef[section_now] == 0 || total_koef[section_now] == undefined || total_koef[section_now] == null)

{

total_koef[section_now] = temp_total_koef

}

// присваиваем текущее значение для форы для кэффа 3 +- koef_how

if (fora[section_now] == 0 || fora[section_now] == undefined || fora[section_now] == null)

{

fora[section_now] = temp_fora

}

if (fora_koef[section_now] == 0 || fora_koef[section_now] == undefined || fora_koef[section_now] == null)

{

fora_koef[section_now] = temp_fora_koef

}

} // конец _part == 2 или == 0

//-------------------------------------------------------------------------------

// 3.1 вариант

if (_part == 3.1) // вариант когда выделяем фору первого

{

// БЛОК ФОРЫ

for (_i=0;_i<dim.length;_i++)

{

if (dim[_i].innerHTML.match(/span data-type="7"/) == 'span data-type="7"') // берём ФОРУ данные 7-я секция

{

result = dim[_i].innerHTML.match(/\+\d{1,3}\.\d{1,3}|\-\d{1,3}\.\d{1,3}|\d{1,3}\.\d{1,3}/g) // берём форы с +, -, и простые

for (_j=0;_j<result.length;_j+=3) // рассматриваем ФОРУ, все элементы

{

if (Math.abs(result[_j+1]-3) <= koef_how )

{

save(result[_j],file_temp)

temp_fora = result[_j]

temp_fora_koef = result[_j+1]

if (stake_type == 2) // если 1 то тоталы, 2 то форы

{

get_one_click()

get_stake(bet1)

// подблок поиска события для ставки

bet = GetClass("bet_type")

for (l=0;l<bet.length;l++)

{

if (result[_j].match(/\+/) == true) // знак форы

{

_sign = "+"

}

else if (result[_j].match(/\-/) == true)

{

_sign = "-"

}

else

{

_sign = " "

}

_fora_result = result[_j].match(/\d{1,3}\.\d{1,3}/) // числовое значение форы

if (bet[l].textContent.match(/1 .\d{1,2}\.5/) == ("1 " + _sign + _fora_result)) // сравнение найденной форы, для первой команды с минусом

{

bet[l].focus()

bet[l].click()

break

}

}

iimPlayCode("WAIT SECONDS = " + pause_stake)

iimPlayCode("TAG POS=1 TYPE=BUTTON ATTR=TXT:ОК")

}

break // выходим из цикла, по первой команде

}

}

break

}

}

} // конец 3.1

//-------------------------------------------------------------------------------

// 3.2 вариант

if (_part == 3.2) // вариант когда выделяем фору первого

{

// БЛОК ФОРЫ

for (_i=0;_i<dim.length;_i++)

{

if (dim[_i].innerHTML.match(/span data-type="7"/) == 'span data-type="7"') // берём ФОРУ данные 7-я секция

{

result = dim[_i].innerHTML.match(/\+\d{1,3}\.\d{1,3}|\-\d{1,3}\.\d{1,3}|\d{1,3}\.\d{1,3}/g) // берём форы с +, -, и простые

_trigger = 0

for (_j=0;_j<result.length;_j+=3) // рассматриваем ФОРУ, все элементы

{

if (Math.abs(result[_j+1]-3) <= koef_how )

{

temp_fora = result[_j]

save(result[_j],file_temp)

temp_fora_koef = result[_j+1]

_trigger++

if (_trigger==2) // выход по второй команде

{

if (stake_type == 2) // если 1 то тоталы, 2 то форы

{

get_one_click()

get_stake(bet1)

// подблок поиска события для ставки

bet = GetClass("bet_type")

for (l=0;l<bet.length;l++)

{

if (result[_j].match(/\+/) == "+") // знак форы

{

_sign = "+"

}

else if (result[_j].match(/\-/) == "-")

{

_sign = "-"

}

else

{

_sign = " "

}

_fora_result = result[_j].match(/\d{1,3}\.\d{1,3}/) // числовое значение форы

if (bet[l].textContent.match(/2 .\d{1,2}\.5/) == ("2 " + _sign + _fora_result)) // сравнение найденной форы, для первой команды с минусом

{

bet[l].focus()

bet[l].click()

break

}

}

iimPlayCode("WAIT SECONDS = " + pause_stake)

iimPlayCode("TAG POS=1 TYPE=BUTTON ATTR=TXT:ОК")

}

break // выходим из цикла

}

}

}

break

}

}

} // конец 3.2

//-------------------------------------------------------------------------------
