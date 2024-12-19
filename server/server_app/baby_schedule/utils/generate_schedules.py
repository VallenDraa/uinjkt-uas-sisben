from dateutil.parser import isoparse
from dateutil.tz import tzlocal
import json
import os
from mistralai import Mistral


client = Mistral(api_key=os.environ.get("LLM_API_KEY"))


def generate_schedules(client: Mistral, serialized_notifications: str):
    if not serialized_notifications:
        return {"values": [], "message": None}

    chat_response = client.chat.complete(
        model="mistral-large-latest",
        messages=[
            {
                "role": "user",
                "content": f"""
                    Saya memiliki sebuah aplikasi untuk memonitoring bayi ketika dia menangis atau merasakan ketidaknyamanan. Data tersebut disimpan dalam format JSON seperti berikut:

                    {serialized_notifications}

                    Dari data JSON tersebut, saya ingin Anda membuat jadwal kegiatan harian (schedule) yang dianggap sangat penting dan esensial bagi bayi. Berikut adalah persyaratannya:

                    Pembagian Waktu dalam Hari:
                        - Pagi: 04:00 - 11:59 WIB
                        - Siang: 12:00 - 14:59 WIB
                        - Sore: 15:00 - 17:59 WIB
                        - Malam: 18:00 - 03:59 WIB
                    
                    Format JSON Output:
                        {'''
                        {
                            "values": [    
                                "title": "<string>", 
                                "description": <string>, 
                                "time": <YYYY-MM-DD'T'hh:mm:ss'Z'>
                            ],
                            "message": <string> | null
                        }'''}
                        - description: Penjelasan singkat terkait aktivitas yang harus dilakukan, penjelasan harus diperjelas berdasarkan klarifikasi notifikasi sehingga orang tua paham apa yang harus dilakukan.
                        - time: Waktu aktivitas dalam format ISO 8601 (YYYY-MM-DD'T'hh:mm:ss'Z').
                        
                    Ketentuan:
                        - Abaikan notifikasi yang hanya berkaitan dengan suhu atau kelembapan ruangan.
                        - Jika tidak ada notifikasi yang cukup relevan untuk membuat jadwal, Anda WAJIB memberikan saran jadwal baru, dengan memberikan pesan yang sesuai di field message. Pesan harus: "Data notifikasi anda belum mencukupi, sehingga kami memberikan saran schedule sebagai berikut."
                        - Jika ada data notifikasi yang relevan, maka field message diisi dengan null.
                    
                    Catatan Penting: 
                        - Saya ingin nilai balikannya berupa JSON saja, tanpa teks tambahan apa pun di luar format tersebut.
                """,
            },
        ],
        response_format={"type": "json_object"},
    )

    schedules: dict = json.loads(chat_response.choices[0].message.content)

    # Process time strings and convert to server timezone
    for schedule in schedules["values"]:
        schedule["time"] = isoparse(schedule["time"]).astimezone(tzlocal())

    return schedules
