from dateutil.parser import isoparse
from dateutil.tz import tzlocal
import json
import os
from mistralai import Mistral


client = Mistral(api_key=os.environ.get("LLM_API_KEY"))


def generate_schedules(client: Mistral, serialized_notifications: str):
    if not serialized_notifications:
        return []

    chat_response = client.chat.complete(
        model="mistral-large-latest",
        messages=[
            {
                "role": "user",
                "content": f"""
                    Jadi saya mempunyai sebuah aplikasi untuk memonitoring bayi
                    ketika dia menangis ataupun merasakan ketidaknyamanan. Data tersebut
                    disimpan sebagai JSON. Berikut adalah jsonnya: 
                    
                    {serialized_notifications}
                    
                    Dari json tersebut saya mau kamu untuk membuat sebuah schedule perharinya. Schedulenya berupa
                    hal yang kira-kira sangatlah esensial bagi bayinya, sehingga dirasa harus dilakukan oleh orang tua
                    secara rutin. Untuk jam pada schedulenya harus ada jam pagi (04:00 - 11:59), siang (12:00 - 14:59), sore (15:00 - 17:59), 
                    dan malam(18:00 - 03:59), letakkan juga nama bagian hari pada title dengan format seperti json dibawah. Abaikan notifikasi yang berhubungan dengan suhu dan kelembapan pada ruangan. Jika memang tidak ada schedule yang bisa dibuat, maka buatkan saran schedule baru tanpa notifikasi, tapi HARUS dan WAJIB beri tahu hal tersebut pada field message pada responsenya. INGAT WAJIB.
                    
                    Saya mau nilai balikannya juga berupa json dan HANYA jsonnya saja, Untuk format jsonnya adalah sebagai berikut: 
                    {'''{
                        "values": [    
                            "title": "[PAGI | SIANG | SORE | MALAM]: <string>", 
                            "description": <string>, 
                            "time": <YYYY-MM-DD'T'hh:mm:ss'Z'>
                        ],
                        "message": "Data notifikasi anda belum mencukupi, sehingga kami memberikan saran schedule sebagai berikut." | null
                    }'''}
                    
                    disini time itu harus dalam format ISO 8601. Ingat saya mau nilai balikannya hanya json.
                """,
            },
        ],
        response_format={"type": "json_object"},
    )

    schedules: dict = json.loads(chat_response.choices[0].message.content)
    print("🚀 ~ schedules:", json.dumps(schedules))

    # Process time strings and convert to server timezone
    for schedule in schedules["values"]:
        schedule["time"] = isoparse(schedule["time"]).astimezone(tzlocal())

    return schedules
