from dateutil.parser import isoparse
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
                    secara rutin. Untuk jam pada schedulenya harus ada jam pagi, siang, sore, 
                    dan malam. Abaikan notifikasi yang berhubungan dengan suhu dan kelembapan jika ruangan.    
                    
                    Saya mau nilai balikannya juga berupa json dan HANYA jsonnya saja, Untuk format jsonnya adalah sebagai berikut: 
                    {'''{ "title": <string>, "description": <string>, "time": <YYYY-MM-DD'T'hh:mm:ss'Z'>}'''}
                    
                    disini time itu harus dalam format ISO 8601. Ingat saya mau nilai balikannya hanya json.
                """,
            },
        ],
        response_format={"type": "json_object"},
    )

    schedules: list = json.loads(chat_response.choices[0].message.content)

    # Process time strings
    for schedule in schedules:
        schedule["time"] = isoparse(schedule["time"])

    return schedules
