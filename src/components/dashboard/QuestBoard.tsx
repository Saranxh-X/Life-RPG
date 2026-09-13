"use client";

import React, { useState } from "react";
import { QuestBoard as QuestsBoard } from "@/components/quests/QuestBoard";
import { AddQuestModal } from "@/components/quests/AddQuestModal";

export function QuestBoard() {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <>
      <AddQuestModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <QuestsBoard onOpenAddQuest={() => setIsAddOpen(true)} />
    </>
  );
}
