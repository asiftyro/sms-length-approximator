'use strict';

const ASCII_NON_PUNCT = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
    31, 35, 36, 37, 38, 42, 43, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 60, 61, 62, 64, 65, 66, 67, 68, 69, 70, 71, 72,
    73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 94, 95, 97, 98, 99, 100, 101, 102, 103,
    104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 127, 128, 129, 131,
    134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 149, 152, 153, 154, 155, 156, 157, 158, 159, 161, 162, 163,
    164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 181, 182, 184, 185, 186, 187, 188,
    189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211,
    212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234,
    235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255
];

const ASCII_PUNCT = [
    32, 33, 34, 39, 40, 41, 44, 45, 46, 47, 58, 59, 63, 91, 92, 93, 96, 123, 124, 125, 126, 130, 132, 133, 145, 146,
    147, 148, 150, 151, 160, 180, 183
];

const NON_PRINTABLE = {
    0: 'NUL', 1: 'SOH', 2: 'STX', 3: 'ETX', 4: 'EOT', 5: 'ENQ', 6: 'ACK', 7: 'BEL', 8: 'BS', 9: 'HT', 10: 'LF',
    11: 'VT', 12: 'FF', 13: 'CR', 14: 'SO', 15: 'SI', 16: 'DLE', 17: 'DC1', 18: 'DC2', 19: 'DC3', 20: 'DC4',
    21: 'NAK', 22: 'SYN', 23: 'ETB', 24: 'CAN', 25: 'EM', 26: 'SUB', 27: 'ESC', 28: 'FS', 29: 'GS', 30: 'RS',
    31: 'US', 32: 'SP', 127: 'DEL', 173: 'SHY', 32: 'SP', 160: 'NBSP',
}

let txt_sms = document.getElementById("txt_sms");
let lnk_clear = document.getElementById("lnk_clear");
let div_result = document.getElementById("div_result");
let prompt_to_enter_sms_content = "Enter SMS content above to analyze...";

div_result.innerHTML = prompt_to_enter_sms_content;

let analyze = (sms_content) => {
    let ascii_non_punct_count = 0;
    let ascii_non_punct_char = "";
    let ascii_punct_count = 0;
    let ascii_punct_char = "";
    let non_ascii_count = 0;
    let non_ascii_char = "";
    let content_type = "";
    let sms_length = sms_content.length;
    let sms_parts = 0;
    
    for (let ch of sms_content) {
        if (ASCII_NON_PUNCT.includes(ch.charCodeAt(0))) {
            ascii_non_punct_count += 1;
            if (ch.charCodeAt(0) in NON_PRINTABLE) {
                ascii_non_punct_char += `<span style="border: 1px dotted gray;padding: 2px 2px;">${NON_PRINTABLE[ch.charCodeAt(0)]}</span> `;
            } else {
                ascii_non_punct_char += `<span style="border: 1px dotted gray;padding: 2px 2px;">${ch}</span> `;
            }
        } else if (ASCII_PUNCT.includes(ch.charCodeAt(0))) {
            ascii_punct_count += 1;
            if (ch.charCodeAt(0) in NON_PRINTABLE) {
                ascii_punct_char += `<span style="border: 1px dotted gray;padding: 2px 2px;">${NON_PRINTABLE[ch.charCodeAt(0)]}</span> `;
            } else {
                ascii_punct_char += `<span style="border: 1px dotted gray;padding: 2px 2px;">${ch}</span> `;
            }
        } else {
            non_ascii_count += 1;
            non_ascii_char += `<span style="border: 1px dotted gray;padding: 2px 2px;">${ch}</span> `;
        }
    } // next ch

    if (non_ascii_count == 0) {
        content_type = "ASCII ONLY"
    } else if (ascii_non_punct_count == 0) {
        content_type = "UNICODE ONLY"
    } else if (non_ascii_count > 0 && ascii_non_punct_count > 0) {
        content_type = "ASCII AND UNICODE MIXED"
    }

    if (content_type == "ASCII ONLY") {
        sms_parts = sms_length <= 160 ? 1 : Math.ceil(sms_length / 156);
    } else {
        sms_parts = sms_length <= 70 ? 1 : Math.ceil(sms_length / 67);
    }

    let non_punct_char_count = ascii_non_punct_count + non_ascii_count;
    let ascii_non_punct_char_perc = non_punct_char_count ? (100 * ascii_non_punct_count / non_punct_char_count).toFixed(2) : 0;
    let non_ascii_punct_char_perc = non_punct_char_count ? (100 * non_ascii_count / non_punct_char_count).toFixed(2) : 0;

    div_result.innerHTML = "";
    div_result.innerHTML += `CONTENT TYPE: <b>${content_type}</b><br><br>TOTAL CHARACTERS: ${sms_length}<br>PARTS: ${sms_parts}<br><br>ASCII LENGTH: <b>${ascii_non_punct_count} (${ascii_non_punct_char_perc}%)</b><br>NON ASCII LENGTH: <b>${non_ascii_count} (${non_ascii_punct_char_perc}%)</b><br>PUNCTUATION AND OTHERS LENGTH: <b>${ascii_punct_count}</b>`;
    div_result.innerHTML = div_result.innerHTML + `<h5>ASCII : ${ascii_non_punct_count} (${ascii_non_punct_char_perc}%)</h5>`;
    div_result.innerHTML = div_result.innerHTML + `<p>${ascii_non_punct_char}</p>`;
    div_result.innerHTML = div_result.innerHTML + `<h5>NON ASCII : ${non_ascii_count} (${non_ascii_punct_char_perc}%)</h5>`;
    div_result.innerHTML = div_result.innerHTML + `<p>${non_ascii_char}</p>`;
    div_result.innerHTML = div_result.innerHTML + `<h5>PUNCTUATION AND OTHERS : ${ascii_punct_count}</h5>`;
    div_result.innerHTML = div_result.innerHTML + `<p>${ascii_punct_char}</p>`;
}

lnk_clear.addEventListener("click", (e) => {
    txt_sms.value = ``;
    div_result.innerHTML = prompt_to_enter_sms_content;
});

txt_sms.addEventListener("input", (e) => {
    let sms_content = e.target.value;
    if (sms_content == '') {
        div_result.innerHTML = prompt_to_enter_sms_content;
        return;
    }
    analyze(sms_content);
});




